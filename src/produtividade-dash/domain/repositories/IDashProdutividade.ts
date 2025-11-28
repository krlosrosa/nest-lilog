import { DemandaProcesso } from 'src/_shared/enums';
import { PaleteGetDataTransporteDto } from 'src/gestao-produtividade/dtos/palete/palete.get.dto';
import { ProdutividadeDiaDiaGetDataDto } from 'src/produtividade-dash/dtos/dash/produtividadeDiaDia';
import { DashboardProdutividadeCenterCreateData } from 'src/produtividade-dash/dtos/produtividade-dash.create.dto';
import { DashboardProdutividadeCenterGetData } from 'src/produtividade-dash/dtos/produtividade-dash.get.dto';
import { DashboardProdutividadeUserCreateData } from 'src/produtividade-dash/dtos/produtividade-user-dash.create.dto';
import { DashboardProdutividadeUserGetData } from 'src/produtividade-dash/dtos/produtividade-user-dash.get.dto';
import {
  QueryFindDemanda,
  QueryFindUserDashboard,
} from 'src/produtividade-dash/dtos/queryFindDemanda';
import { DashDiaDiaParams } from 'src/produtividade-dash/infra/dashDiaDia';

export interface IDashProdutividadeRepository {
  createCenterDashboard(
    data: DashboardProdutividadeCenterCreateData,
  ): Promise<void>;
  createUserDashboard(
    data: DashboardProdutividadeUserCreateData,
  ): Promise<void>;
  updateCenterDashboard(
    id: number,
    data: DashboardProdutividadeCenterCreateData,
  ): Promise<void>;
  updateUserDashboard(
    id: number,
    data: DashboardProdutividadeUserCreateData,
  ): Promise<void>;
  findAllCenterDashboards(
    params: QueryFindDemanda,
  ): Promise<DashboardProdutividadeCenterGetData[]>;
  findAllUserDashboards(
    params: QueryFindUserDashboard,
  ): Promise<DashboardProdutividadeUserGetData[]>;
  dashDiaDia(params: DashDiaDiaParams): Promise<ProdutividadeDiaDiaGetDataDto>;
  getPaletesEmAberto(
    centerId: string,
    data: string,
    processo: DemandaProcesso,
  ): Promise<PaleteGetDataTransporteDto[]>;
}
