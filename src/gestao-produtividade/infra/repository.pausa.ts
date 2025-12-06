import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { IPausaRepository } from '../domain/repository/IPausa.repository';
import { PausaCreateData } from '../dtos/pausa/pausa.create.dto';
import { demanda, palete, pausa, pausaGeral } from 'src/_shared/infra/drizzle';
import { DemandaStatus } from 'src/_shared/enums';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import {
  FindPausaGeral,
  PausaGeralCreateDataDto,
} from '../dtos/pausaGeral/pausaGeral.create.dto';
import { buscarPausasGeraisQuery } from './queries/buscarPausasGerais';
import { PausaGeralSearchParamsDto } from '../dtos/pausaGeral/pausaGeral.update.dto';
import { PausaGeralGetDataDto } from '../dtos/pausaGeral/pausaGeral.get.dto';

export class PausaRepositoryDrizzle implements IPausaRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(params: PausaCreateData): Promise<void> {
    await this.db.transaction(async (tx) => {
      await this.db.insert(pausa).values(params);
      // Atualiza o status da demanda para pausada
      await tx
        .update(demanda)
        .set({
          status: DemandaStatus.PAUSA,
        })
        .where(eq(demanda.id, params.demandaId));
      // Atualiza o status das paletes para em pausa
      await tx
        .update(palete)
        .set({
          status: StatusPalete.EM_PAUSA,
        })
        .where(eq(palete.demandaId, params.demandaId));
    });
  }

  async finalizar(demandaId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(palete)
        .set({
          status: StatusPalete.EM_PROGRESSO,
        })
        .where(eq(palete.demandaId, demandaId));

      // Atualiza o status da demanda para em produção
      await tx
        .update(demanda)
        .set({
          status: DemandaStatus.EM_PROGRESSO,
        })
        .where(eq(demanda.id, demandaId));

      // Atualiza o fim da pausa
      await tx
        .update(pausa)
        .set({
          fim: new Date().toISOString(),
        })
        .where(eq(pausa.demandaId, demandaId));
    });
    // Atualiza o status das paletes para em produção
  }

  async criarPausaGeral(
    registradoPorId: string,
    params: PausaGeralCreateDataDto,
    demandaIds: number[],
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      const pausaGeralId = await this.db
        .insert(pausaGeral)
        .values({
          inicio: new Date().toISOString(),
          centerId: params.centerId,
          processo: params.processo,
          turno: params.turno,
          motivo: params.motivo,
          registradoPorId: registradoPorId,
          atualizadoEm: new Date().toISOString(),
          segmento: params.segmento,
        })
        .returning({ id: pausaGeral.id });

      const pausas = demandaIds.map((demandaId) => ({
        inicio: new Date().toISOString(),
        registradoPorId: registradoPorId,
        motivo: params.motivo,
        demandaId: demandaId,
        pausaGeralId: pausaGeralId[0].id,
      }));

      if (pausas.length > 0) {
        await tx.insert(pausa).values(pausas);
      }

      await tx
        .update(demanda)
        .set({
          status: DemandaStatus.PAUSA,
        })
        .where(inArray(demanda.id, demandaIds));

      await tx
        .update(palete)
        .set({
          status: StatusPalete.EM_PAUSA,
        })
        .where(inArray(palete.demandaId, demandaIds));
    });
  }

  async finalizarPausaGeral(ids: number[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      const pausas = await tx
        .select()
        .from(pausa)
        .where(inArray(pausa.pausaGeralId, ids));

      const demandasIds = pausas.map((pausa) => pausa.demandaId);

      if (demandasIds.length > 0) {
        await tx
          .update(demanda)
          .set({
            status: DemandaStatus.EM_PROGRESSO,
          })
          .where(inArray(demanda.id, demandasIds));
        await tx
          .update(palete)
          .set({
            status: StatusPalete.EM_PROGRESSO,
          })
          .where(inArray(palete.demandaId, demandasIds));
      }

      // Atualiza o fim da pausa geral
      await tx
        .update(pausaGeral)
        .set({
          fim: new Date().toISOString(),
        })
        .where(inArray(pausaGeral.id, ids));

      await tx
        .update(pausa)
        .set({
          fim: new Date().toISOString(),
        })
        .where(inArray(pausa.pausaGeralId, ids));
    });
  }

  async findAll(
    centerId: string,
    params: PausaGeralSearchParamsDto,
  ): Promise<PausaGeralGetDataDto[]> {
    return await buscarPausasGeraisQuery(this.db, centerId, params);
  }

  async findPausaGeralByParams(
    params: FindPausaGeral,
  ): Promise<PausaGeralGetDataDto | undefined> {
    const resultado = await this.db
      .select()
      .from(pausaGeral)
      .where(
        and(
          eq(pausaGeral.segmento, params.segmento),
          eq(pausaGeral.processo, params.processo),
          eq(pausaGeral.turno, params.turno),
          eq(pausaGeral.centerId, params.centerId),
          isNull(pausaGeral.fim),
        ),
      )
      .limit(1);

    if (resultado.length === 0) {
      return undefined;
    }

    return resultado[0];
  }
}
