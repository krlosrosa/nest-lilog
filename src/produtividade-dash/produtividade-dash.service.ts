import { Inject, Injectable } from '@nestjs/common';
import { type IDashProdutividadeRepository } from './domain/repositories/IDashProdutividade';
import {
  QueryFindDemanda,
  QueryFindUserDashboard,
} from './dtos/queryFindDemanda';
import { DashboardProdutividadeCenterGetData } from './dtos/produtividade-dash.get.dto';
import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';
import { DashboardProdutividadeCenterCreateData } from './dtos/produtividade-dash.create.dto';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';
import { DashboardProdutividadeUserCreateData } from './dtos/produtividade-user-dash.create.dto';
import { DashboardProdutividadeUserGetData } from './dtos/produtividade-user-dash.get.dto';
import { DashDiaDiaParams } from './infra/dashDiaDia';
import { ProdutividadeDiaDiaGetDataDto } from './dtos/dash/produtividadeDiaDia';
import { PaleteGetDataTransporteDto } from 'src/gestao-produtividade/dtos/palete/palete.get.dto';

@Injectable()
export class ProdutividadeDashService {
  constructor(
    @Inject('IDashProdutividadeRepository')
    private readonly produtividadeRepository: IDashProdutividadeRepository,
  ) {}

  async atualizarProdutividadePorCentro(
    params: QueryFindDemanda,
    demanda: Demanda,
  ): Promise<void> {
    const demandas =
      await this.produtividadeRepository.findAllCenterDashboards(params);
    if (demandas.length > 0) {
      const item: DashboardProdutividadeCenterGetData = demandas[0];
      const novoRegistro: DashboardProdutividadeCenterCreateData = {
        ...item,
        totalCaixas: item.totalCaixas + demanda.quantidadeCaixas(),
        totalUnidades: item.totalUnidades + demanda.quantidadeUnidades(),
        totalPaletes: item.totalPaletes + demanda.quantidadePaletes(),
        totalEnderecos: item.totalEnderecos + demanda.quantidadeVisitas(),
        totalPausasQuantidade:
          item.totalPausasQuantidade + demanda.quantidadePausas(),
        totalPausasTempo: item.totalPausasTempo + demanda.calcularTempoPausas(),
        totalTempoTrabalhado:
          item.totalTempoTrabalhado + demanda.calcularTempoTrabalhado(),
        totalDemandas: item.totalDemandas + demanda.quantidadePaletesDemanda(),
      };
      await this.produtividadeRepository.updateCenterDashboard(
        item.id,
        novoRegistro,
      );
    } else {
      const novoRegistro: DashboardProdutividadeCenterCreateData = {
        centerId: params.centerId,
        cluster: params.cluster,
        empresa: params.empresa,
        processo: params.processo as DemandaProcesso,
        turno: params.turno as DemandaTurno,
        dataRegistro: new Date(
          params.dataRegistro + 'T00:00:00.000Z',
        ).toISOString(),
        totalCaixas: demanda.quantidadeCaixas(),
        totalUnidades: demanda.quantidadeUnidades(),
        totalPaletes: demanda.quantidadePaletes(),
        totalEnderecos: demanda.quantidadeVisitas(),
        totalPausasQuantidade: demanda.quantidadePausas(),
        totalPausasTempo: demanda.calcularTempoPausas(),
        totalTempoTrabalhado: demanda.calcularTempoTrabalhado(),
        totalDemandas: demanda.quantidadePaletesDemanda(),
        atualizadoEm: new Date().toISOString(),
      };
      await this.produtividadeRepository.createCenterDashboard(novoRegistro);
    }
    return;
  }
  async atualizarProdutividadePorUsuario(
    params: QueryFindUserDashboard,
    demanda: Demanda,
  ): Promise<void> {
    const demandas =
      await this.produtividadeRepository.findAllUserDashboards(params);
    if (demandas.length > 0) {
      const item: DashboardProdutividadeUserGetData = demandas[0];
      const novoRegistro: DashboardProdutividadeUserGetData = {
        ...item,
        totalCaixas: item.totalCaixas + demanda.quantidadeCaixas(),
        totalUnidades: item.totalUnidades + demanda.quantidadeUnidades(),
        totalPaletes: item.totalPaletes + demanda.quantidadePaletes(),
        totalEnderecos: item.totalEnderecos + demanda.quantidadeVisitas(),
        totalPausasQuantidade:
          item.totalPausasQuantidade + demanda.quantidadePausas(),
        totalPausasTempo: item.totalPausasTempo + demanda.calcularTempoPausas(),
        totalTempoTrabalhado:
          item.totalTempoTrabalhado + demanda.calcularTempoTrabalhado(),
        totalDemandas: item.totalDemandas + demanda.quantidadePaletesDemanda(),
      };
      await this.produtividadeRepository.updateUserDashboard(
        item.id,
        novoRegistro,
      );
    } else {
      const novoRegistro: DashboardProdutividadeUserCreateData = {
        centerId: params.centerId,
        funcionarioId: demanda.funcionarioId,
        processo: params.processo as DemandaProcesso,
        turno: params.turno as DemandaTurno,
        dataRegistro: params.dataRegistro,
        totalCaixas: demanda.quantidadeCaixas(),
        totalUnidades: demanda.quantidadeUnidades(),
        totalPaletes: demanda.quantidadePaletes(),
        totalEnderecos: demanda.quantidadeVisitas(),
        totalPausasQuantidade: demanda.quantidadePausas(),
        totalPausasTempo: demanda.calcularTempoPausas(),
        totalTempoTrabalhado: demanda.calcularTempoTrabalhado(),
        totalDemandas: demanda.quantidadePaletesDemanda(),
        atualizadoEm: new Date().toISOString(),
      };
      await this.produtividadeRepository.createUserDashboard(novoRegistro);
    }
    return;
  }

  async dashDiaDia(
    params: DashDiaDiaParams,
  ): Promise<ProdutividadeDiaDiaGetDataDto> {
    return await this.produtividadeRepository.dashDiaDia(params);
  }

  async getPaletesEmAberto(
    centerId: string,
    data: string,
    processo: DemandaProcesso,
  ): Promise<PaleteGetDataTransporteDto[]> {
    return await this.produtividadeRepository.getPaletesEmAberto(
      centerId,
      data,
      processo,
    );
  }
}
