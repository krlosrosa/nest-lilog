import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DevolucaoMobileService } from './devolucao.mobile.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddCheckListDto } from './dto/mobile/checkList.dto';
import { ItensContabilDto } from './dto/mobile/itensContabil.dto';
import { StartDemandaDto } from './dto/mobile/startDemanda.dto';
import { AddConferenciaCegaDto } from './dto/mobile/addConferenciaCega.dto';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AnomaliaDevolucaoDto } from './dto/mobile/anomaliaDevolucao.dto';

@ApiTags('devolucao-mobile')
@UseGuards(AuthGuard)
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
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<ListarDemandasDto[]> {
    return this.devolucaoMobileService.listarDemandasEmAberto(
      centerId,
      accountId,
    );
  }

  @Post('start-demanda/')
  @ApiOperation({
    summary: 'Iniciar conferência',
    operationId: 'startDemandaDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Conferência iniciada com sucesso',
    type: [ItensContabilDto],
  })
  @ApiBody({ type: StartDemandaDto })
  async startDemanda(
    @Body() demanda: StartDemandaDto,
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<ItensContabilDto[]> {
    return this.devolucaoMobileService.startDemanda(demanda, accountId);
  }

  @Post('add-contagem-cega/:demandaId')
  @ApiOperation({
    summary: 'Iniciar conferência',
    operationId: 'addContagemCega',
  })
  @ApiResponse({
    status: 200,
    description: 'Conferência iniciada com sucesso',
  })
  @ApiBody({ type: [AddConferenciaCegaDto] })
  async addContagemCega(
    @Param('demandaId') demandaId: string,
    @Body() conferencia: AddConferenciaCegaDto[],
  ): Promise<void> {
    return this.devolucaoMobileService.addConferenciaFisica(
      demandaId,
      conferencia,
    );
  }

  @Post('finalizar-demanda/:demandaId')
  @ApiOperation({
    summary: 'Finalizar demanda',
    operationId: 'finalizarDemandaDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda finalizada com sucesso',
  })
  async finalizarDemanda(@Param('demandaId') demandaId: string): Promise<void> {
    return this.devolucaoMobileService.finalizarDemanda(demandaId);
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

  @Get('get-status-by-id/:demandaId')
  @ApiOperation({
    summary: 'Pegar Status pelo ID',
    operationId: 'getStatusById',
  })
  @ApiResponse({
    status: 200,
    description: 'get status by ID',
    type: String,
  })
  async getDemandaById(@Param('demandaId') demandaId: string): Promise<string> {
    return this.devolucaoMobileService.getDemandaById(demandaId);
  }

  @Post('add-anomalia-devolucao')
  @ApiOperation({
    summary: 'Adicionar anomalia de devolução',
    operationId: 'addAnomaliaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Anomalia de devolução adicionada com sucesso',
  })
  @ApiBody({ type: AnomaliaDevolucaoDto })
  async addAnomaliaDevolucao(
    @Body() anomalia: AnomaliaDevolucaoDto,
  ): Promise<void> {
    return this.devolucaoMobileService.addAnomaliaDevolucao(anomalia);
  }
}
