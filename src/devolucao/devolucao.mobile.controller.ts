import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DevolucaoMobileService } from './devolucao.mobile.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddCheckListDto } from './dto/mobile/checkList.dto';
import { ItensContabilDto } from './dto/mobile/itensContabil.dto';

@ApiTags('devolucao-mobile')
@Controller('devolucao-mobile')
export class DevolucaoMobileController {
  constructor(
    private readonly devolucaoMobileService: DevolucaoMobileService,
  ) {}

  @Post('add-check-list/:demandaId')
  @ApiOperation({
    summary: 'Adicionar check list',
    operationId: 'addCheckListDevolucaoMobile',
  })
  @ApiBody({ type: AddCheckListDto })
  @ApiResponse({
    status: 200,
    description: 'Check list adicionado com sucesso',
    type: String,
  })
  async addCheckList(
    @Param('demandaId') demandaId: string,
    @Body() addCheckListDto: AddCheckListDto,
  ): Promise<void> {
    return this.devolucaoMobileService.addCheckList(addCheckListDto, demandaId);
  }

  @Get('listar-demandas-em-aberto/:centerId')
  @ApiOperation({
    summary: 'Listar demandas em aberto',
    operationId: 'listarDemandasEmAbertoDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Demandas em aberto listadas com sucesso',
    type: [ListarDemandasDto],
  })
  async listarDemandasEmAberto(
    @Param('centerId') centerId: string,
  ): Promise<ListarDemandasDto[]> {
    return this.devolucaoMobileService.listarDemandasEmAberto(
      centerId,
      '421931',
    );
  }

  @Post('start-demanda/:demandaId')
  @ApiOperation({
    summary: 'Iniciar conferência',
    operationId: 'startDemandaDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Conferência iniciada com sucesso',
    type: String,
  })
  async startDemanda(@Param('demandaId') demandaId: string): Promise<void> {
    return this.devolucaoMobileService.startDemanda(demandaId, '421931');
  }

  @Get('get-itens-contabil/:demandaId')
  @ApiOperation({
    summary: 'Listar itens contabilizados',
    operationId: 'getItensContabilDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Itens contabilizados listados com sucesso',
    type: [ItensContabilDto],
  })
  async getItensContabilizados(
    @Param('demandaId') demandaId: string,
  ): Promise<ItensContabilDto[]> {
    return this.devolucaoMobileService.getItensContabilizados(demandaId);
  }
}
