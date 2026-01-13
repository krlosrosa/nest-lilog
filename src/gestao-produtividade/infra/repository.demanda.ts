import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { Demanda } from '../domain/entities/demanda.entity';
import { FindAllParams } from '../dtos/params.dto';
// import { buscarDemandasQuery } from './queries/buscarDemandas';
import { overViewProdutividadeQuery } from './queries/overViewProdutividade';
import { demanda, palete } from 'src/_shared/infra/drizzle';
import { and, count, eq, inArray, ne } from 'drizzle-orm';
import { Palete } from '../domain/entities/palete.entity';
import { DemandaProcesso } from 'src/_shared/enums';
import { OverViewProdutividadeDataDto } from '../dtos/produtividade/produtivididade.overView.dto';
import { pausa, user } from 'src/_shared/infra/drizzle/migrations/schema';
import { agruparDemandasComRelacionamentos } from '../utils/agruparDemandasComRelacionamentos';
import { buscarDemandasQuery } from './queries/buscarDemandas';

export class ProdutividadeRepositoryDrizzle
  implements IDemandaProdutividadeRepository
{
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async findAll(params: FindAllParams): Promise<Demanda[]> {
    const demandas = await buscarDemandasQuery(this.db, params);
    return demandas.map((demanda) => Demanda.fromData(demanda));
  }

  async findById(idDemanda: string): Promise<Demanda | undefined> {
    const demandaData = await this.db
      .select()
      .from(demanda)
      .where(eq(demanda.id, Number(idDemanda)))
      .leftJoin(pausa, eq(demanda.id, pausa.demandaId))
      .leftJoin(palete, eq(demanda.id, palete.demandaId))
      .leftJoin(user, eq(demanda.funcionarioId, user.id));
    if (!demandaData || demandaData.length === 0) {
      return undefined;
    }

    const demandaEncontrada = agruparDemandasComRelacionamentos(demandaData);
    return Demanda.fromData(demandaEncontrada[0]);
  }

  async findPaletes(paletesId: string[]): Promise<Palete[]> {
    const paletes = await this.db
      .select()
      .from(palete)
      .where(inArray(palete.id, paletesId));
    return paletes.map((palete) => Palete.fromData(palete));
  }

  async getDemandaByPaleteId(paleteId: string): Promise<Demanda | undefined> {
    const demanda = await this.db.query.palete.findFirst({
      where: eq(palete.id, paleteId),
      with: {
        demanda: {
          with: {
            pausas: true,
            paletes: true,
          },
        },
      },
    });

    if (!demanda || !demanda.demanda) {
      return undefined;
    }
    return Demanda.fromData(demanda.demanda);
  }

  async create(demandaData: Demanda, paletesIds: string[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      const demandaCriada = await tx
        .insert(demanda)
        .values({
          cadastradoPorId: demandaData.cadastradoPorId,
          funcionarioId: demandaData.funcionarioId,
          centerId: demandaData.centerId,
          processo: demandaData.processo,
          turno: demandaData.turno,
          inicio: demandaData.inicio,
          dataExpedicao: demandaData.dataExpedicao,
          obs: demandaData.obs,
          status: demandaData.status,
        })
        .returning();

      const paletesAtualizados = await tx
        .update(palete)
        .set({
          demandaId: demandaCriada[0].id,
          status: 'EM_PROGRESSO',
          inicio: demandaData.inicio,
        })
        .where(inArray(palete.id, paletesIds))
        .returning();
    });
  }

  async finalizarPalete(paletes: Palete[]): Promise<void> {
    const paletesIds = paletes.map((palete) => palete.id);
    await this.db
      .update(palete)
      .set({
        status: 'CONCLUIDO',
        validado: true,
        atualizadoEm: new Date().toISOString(),
        fim: new Date().toISOString(),
      })
      .where(inArray(palete.id, paletesIds));
  }

  async finalizarDemandas(demandas: Demanda[]): Promise<void> {
    await this.db
      .update(demanda)
      .set({
        status: 'FINALIZADA',
        fim: new Date().toISOString(),
      })
      .where(
        inArray(
          demanda.id,
          demandas.map((demanda) => demanda.id),
        ),
      );
  }

  async overViewProdutividade(
    centerId: string,
    processo: DemandaProcesso,
    dataRegistro: string,
  ): Promise<OverViewProdutividadeDataDto> {
    return await overViewProdutividadeQuery(
      this.db,
      centerId,
      processo,
      dataRegistro,
    );
  }

  async delete(demandaId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(palete)
        .set({ demandaId: null })
        .where(eq(palete.demandaId, demandaId));
      await tx.delete(demanda).where(eq(demanda.id, demandaId));
    });
  }

  async countPaletesDemanda(id: number): Promise<number> {
    const [row] = await this.db
      .select({ total: count() })
      .from(palete)
      .where(and(eq(palete.demandaId, id), ne(palete.status, 'CONCLUIDO')));

    return Number(row.total);
  }
}
