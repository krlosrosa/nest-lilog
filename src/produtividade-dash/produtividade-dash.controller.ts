import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProdutividadeDashService } from './produtividade-dash.service';
import { type DashDiaDiaParams } from './infra/dashDiaDia';
import { ProdutividadeDiaDiaGetDataDto } from './dtos/dash/produtividadeDiaDia';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaleteGetDataTransporteDto } from 'src/gestao-produtividade/dtos/palete/palete.get.dto';
import { DemandaProcesso } from 'src/_shared/enums';

@Controller('produtividade-dash')
export class ProdutividadeDashController {
  constructor(
    private readonly produtividadeDashService: ProdutividadeDashService,
  ) {}

  @Get('dash-dia-dia')
  @ApiOperation({
    summary: 'Buscar a produtividade dia a dia',
    operationId: 'dashDiaDia',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtividade dia a dia encontrada com sucesso',
    type: ProdutividadeDiaDiaGetDataDto,
  })
  async dashDiaDia(
    @Query() query: DashDiaDiaParams,
  ): Promise<ProdutividadeDiaDiaGetDataDto> {
    return await this.produtividadeDashService.dashDiaDia(query);
  }

  @Get('paletes-em-aberto/:centerId/:data/:processo')
  @ApiOperation({
    summary: 'Buscar paletes em aberto',
    operationId: 'getPaletesEmAberto',
  })
  @ApiResponse({
    status: 200,
    description: 'Paletes em aberto encontrados com sucesso',
    type: [PaleteGetDataTransporteDto],
  })
  async getPaletesEmAberto(
    @Param('centerId') centerId: string,
    @Param('data') data: string,
    @Param('processo') processo: DemandaProcesso,
  ): Promise<PaleteGetDataTransporteDto[]> {
    return await this.produtividadeDashService.getPaletesEmAberto(
      centerId,
      data,
      processo,
    );
  }
}
