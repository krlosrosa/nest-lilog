import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { Demanda } from '../domain/entities/demanda.entity';
import { FindAllParams } from '../dtos/params.dto';
// import { buscarDemandasQuery } from './queries/buscarDemandas';
import { overViewProdutividadeQuery } from './queries/overViewProdutividade';
import { demanda, palete } from 'src/_shared/infra/drizzle';
import { eq, inArray } from 'drizzle-orm';
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
    if (!demandaData) {
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
    const demandaCriada = await this.db
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

    await this.db
      .update(palete)
      .set({
        demandaId: demandaCriada[0].id,
        status: 'EM_PROGRESSO',
        inicio: demandaData.inicio,
      })
      .where(inArray(palete.id, paletesIds));
  }

  async finalizarPalete(paletes: Palete[]): Promise<void> {
    console.log('paletes', paletes);
    const paletesIds = paletes.map((palete) => palete.id);
    console.log('paletesIds', paletesIds);
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
        status: demandas[0].status,
        fim: demandas[0].fim,
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
    await this.db
      .update(palete)
      .set({ demandaId: null })
      .where(eq(palete.demandaId, demandaId));
    await this.db.delete(demanda).where(eq(demanda.id, demandaId));
  }
}
