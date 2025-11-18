import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { type IDashProdutividadeRepository } from '../domain/repositories/IDashProdutividade';
import {
  dashboardProdutividadeCenter,
  dashboardProdutividadeUser,
} from 'src/_shared/infra/drizzle';
import {
  QueryFindDemanda,
  QueryFindUserDashboard,
} from '../dtos/queryFindDemanda';

import { and, eq } from 'drizzle-orm';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';
import { DashboardProdutividadeCenterGetData } from '../dtos/produtividade-dash.get.dto';
import { DashboardProdutividadeCenterCreateData } from '../dtos/produtividade-dash.create.dto';
import { DashboardProdutividadeUserCreateData } from '../dtos/produtividade-user-dash.create.dto';
import { DashboardProdutividadeUserGetData } from '../dtos/produtividade-user-dash.get.dto';

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
}
