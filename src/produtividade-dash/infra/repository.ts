import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { type IDashProdutividadeRepository } from '../domain/repositories/IDashProdutividade';
import {
  dashboardProdutividadeCenter,
  dashboardProdutividadeUser,
  palete,
  transporte,
} from 'src/_shared/infra/drizzle';
import {
  QueryFindDemanda,
  QueryFindUserDashboard,
} from '../dtos/queryFindDemanda';

import { and, eq, ne } from 'drizzle-orm';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';
import { DashboardProdutividadeCenterGetData } from '../dtos/produtividade-dash.get.dto';
import { DashboardProdutividadeCenterCreateData } from '../dtos/produtividade-dash.create.dto';
import { DashboardProdutividadeUserCreateData } from '../dtos/produtividade-user-dash.create.dto';
import { DashboardProdutividadeUserGetData } from '../dtos/produtividade-user-dash.get.dto';
import { dashDiaDia, DashDiaDiaParams } from './dashDiaDia';
import { ProdutividadeDiaDiaGetDataDto } from '../dtos/dash/produtividadeDiaDia';
import { PaleteGetDataTransporteDto } from 'src/gestao-produtividade/dtos/palete/palete.get.dto';
import { sql } from 'drizzle-orm';

export class DashProdutividadeRepositoryDrizzle
  implements IDashProdutividadeRepository
{
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async findAllCenterDashboards(
    params: QueryFindDemanda,
  ): Promise<DashboardProdutividadeCenterGetData[]> {
    const demandas = await this.db
      .select()
      .from(dashboardProdutividadeCenter)
      .where(
        and(
          eq(dashboardProdutividadeCenter.centerId, params.centerId),
          eq(dashboardProdutividadeCenter.empresa, params.empresa),
          eq(
            dashboardProdutividadeCenter.processo,
            params.processo as DemandaProcesso,
          ),
          eq(dashboardProdutividadeCenter.turno, params.turno as DemandaTurno),
          eq(dashboardProdutividadeCenter.cluster, params.cluster),
          eq(dashboardProdutividadeCenter.dataRegistro, params.dataRegistro),
        ),
      );

    return demandas;
  }
  async findAllUserDashboards(
    params: QueryFindUserDashboard,
  ): Promise<DashboardProdutividadeUserGetData[]> {
    const demandas = await this.db
      .select()
      .from(dashboardProdutividadeUser)
      .where(
        and(
          eq(dashboardProdutividadeUser.funcionarioId, params.funcionarioId),
          eq(dashboardProdutividadeUser.centerId, params.centerId),
          eq(
            dashboardProdutividadeUser.processo,
            params.processo as DemandaProcesso,
          ),
          eq(dashboardProdutividadeUser.turno, params.turno as DemandaTurno),
          eq(dashboardProdutividadeUser.dataRegistro, params.dataRegistro),
        ),
      );

    return demandas;
  }

  async createCenterDashboard(
    data: DashboardProdutividadeCenterGetData,
  ): Promise<void> {
    await this.db.insert(dashboardProdutividadeCenter).values(data);
  }

  async updateCenterDashboard(
    id: number,
    data: DashboardProdutividadeCenterCreateData,
  ): Promise<void> {
    await this.db
      .update(dashboardProdutividadeCenter)
      .set(data)
      .where(eq(dashboardProdutividadeCenter.id, id));
  }

  async createUserDashboard(
    data: DashboardProdutividadeUserCreateData,
  ): Promise<void> {
    await this.db.insert(dashboardProdutividadeUser).values(data);
  }

  async updateUserDashboard(
    id: number,
    data: DashboardProdutividadeUserCreateData,
  ): Promise<void> {
    await this.db
      .update(dashboardProdutividadeUser)
      .set(data)
      .where(eq(dashboardProdutividadeUser.id, id));
  }

  async dashDiaDia(
    params: DashDiaDiaParams,
  ): Promise<ProdutividadeDiaDiaGetDataDto> {
    return await dashDiaDia(this.db, params);
  }

  async getPaletesEmAberto(
    centerId: string,
    data: string,
    processo: DemandaProcesso,
  ): Promise<PaleteGetDataTransporteDto[]> {
    const paletes = await this.db
      .select({
        palete_id: palete.id,
        empresa: palete.empresa,
        quantidadeCaixas: palete.quantidadeCaixas,
        quantidadeUnidades: palete.quantidadeUnidades,
        quantidadePaletes: palete.quantidadePaletes,
        enderecoVisitado: palete.enderecoVisitado,
        segmento: palete.segmento,
        tipoProcesso: palete.tipoProcesso,
        status_palete: palete.status,
        transporteId: palete.transporteId,
        centerId: transporte.centerId,
        data_expedicao: sql<string>`${transporte.dataExpedicao}::date`,
      })
      .from(palete)
      .innerJoin(
        transporte,
        eq(palete.transporteId, transporte.numeroTransporte),
      )
      .where(
        and(
          ne(palete.status, 'CONCLUIDO'),
          eq(palete.tipoProcesso, processo),
          eq(transporte.centerId, centerId),
          sql`${transporte.dataExpedicao}::date = ${data}`,
        ),
      )
      .orderBy(palete.id);
    return paletes;
  }
}
