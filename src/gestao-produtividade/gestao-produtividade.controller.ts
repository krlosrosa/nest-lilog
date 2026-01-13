import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GestaoProdutividadeService } from './gestao-produtividade.service';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { DemandaCreateDataComPaletesIds } from './dtos/demanda/demanda.create.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { PausaCreateDataDto } from './dtos/pausa/pausa.create.dto';
import { PausaGeralCreateDataDto } from './dtos/pausaGeral/pausaGeral.create.dto';
import { PausaGeralSearchParamsDto } from './dtos/pausaGeral/pausaGeral.update.dto';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';
import { type FindAllParams } from './dtos/params.dto';
import {
  ProdutividadeGetDataDto,
  ProdutividadeWithPausaAndPaleteDto,
} from './dtos/produtividade/produtividade.model.dto';
import { OverViewProdutividadeDataDto } from './dtos/produtividade/produtivididade.overView.dto';
import { PausaGeralGetDataDto } from './dtos/pausaGeral/pausaGeral.get.dto';
import { DemandaDto } from './dtos/produtividade/demanda.dto';

@Controller('gestao-produtividade')
@ApiTags('gestao-produtividade')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class GestaoProdutividadeController {
  constructor(
    private readonly gestaoProdutividadeService: GestaoProdutividadeService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova demanda de produtividade',
    operationId: 'criarDemandaProdutividade',
  })
  @ApiBody({ type: DemandaCreateDataComPaletesIds })
  create(
    @Body() params: DemandaCreateDataComPaletesIds,
    @AccountId() accountId: string,
  ) {
    return this.gestaoProdutividadeService.create(params, accountId);
  }

  @Post('finalizar-palete')
  @ApiOperation({
    summary: 'Finalizar uma palete de uma demanda de produtividade',
    operationId: 'finalizarPaleteProdutividade',
  })
  @ApiBody({ type: [String] })
  finalizarPalete(@Body() paleteId: string[], @AccountId() accountId: string) {
    return this.gestaoProdutividadeService.finalizarPalete(paleteId, accountId);
  }

  @Post('add-pausa-individual/:paleteId')
  @ApiOperation({
    summary: 'Adicionar uma pausa individual a uma demanda de produtividade',
    operationId: 'addPausaIndividual',
  })
  @ApiBody({ type: PausaCreateDataDto })
  addPausaIndividual(
    @Param('paleteId') paleteId: string,
    @Body() params: PausaCreateDataDto,
    @AccountId() accountId: string,
  ) {
    return this.gestaoProdutividadeService.addPausaIndividual(
      paleteId,
      params,
      accountId,
    );
  }

  @Post('finalizar-pausa-individual/:paleteId')
  @ApiOperation({
    summary: 'Finalizar uma pausa individual de uma demanda de produtividade',
    operationId: 'finalizarPausaIndividual',
  })
  finalizarPausaIndividual(@Param('paleteId') paleteId: string) {
    return this.gestaoProdutividadeService.finalizarPausaIndividual(paleteId);
  }

  @Post('add-pausa-geral')
  @ApiOperation({
    summary: 'Adicionar uma pausa geral a uma demanda de produtividade',
    operationId: 'addPausaGeral',
  })
  @ApiBody({ type: PausaGeralCreateDataDto })
  addPausaGeral(
    @Body() params: PausaGeralCreateDataDto,
    @AccountId() accountId: string,
  ) {
    return this.gestaoProdutividadeService.addPausaGeral(params, accountId);
  }

  @Post('finalizar-pausa-geral/:centerId/:segmento/:turno/:processo')
  @ApiOperation({
    summary: 'Finalizar uma pausa geral a uma demanda de produtividade',
    operationId: 'finalizarPausaGeral',
  })
  finalizarPausaGeral(
    @Param('centerId') centerId: string,
    @Param('segmento') segmento: string,
    @Param('turno') turno: DemandaTurno,
    @Param('processo') processo: DemandaProcesso,
  ) {
    return this.gestaoProdutividadeService.finalizarPausaGeral(
      centerId,
      segmento,
      turno,
      processo,
    );
  }

  @Get('buscar-pausas-ativas/:centerId')
  @ApiOperation({
    summary: 'Buscar as pausas ativas de uma demanda de produtividade',
    operationId: 'buscarPausasAtivas',
  })
  @ApiResponse({
    status: 200,
    description: 'Pausas ativas encontradas com sucesso',
    type: [PausaGeralGetDataDto],
  })
  buscarPausasAtivas(
    @Param('centerId') centerId: string,
    @Query() params: PausaGeralSearchParamsDto,
  ) {
    return this.gestaoProdutividadeService.buscarPausasAtivas(centerId, params);
  }

  @Get('get-produtividade/:centerId')
  @ApiOperation({
    summary: 'Buscar a produtividade de uma demanda de produtividade',
    operationId: 'getProdutividade',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtividade encontrada com sucesso',
    type: [ProdutividadeGetDataDto],
  })
  getProdutividade(
    @Param('centerId') centerId: string,
    @Query() params: FindAllParams,
  ) {
    return this.gestaoProdutividadeService.getProdutividade(centerId, params);
  }

  @Get('over-view-produtividade/:centerId/:processo/:dataRegistro')
  @ApiOperation({
    summary: 'Buscar a visão geral da produtividade',
    operationId: 'overViewProdutividade',
  })
  @ApiResponse({
    status: 200,
    description: 'Visão geral da produtividade encontrada com sucesso',
    type: OverViewProdutividadeDataDto,
  })
  overViewProdutividade(
    @Param('centerId') centerId: string,
    @Param('processo') processo: DemandaProcesso,
    @Param('dataRegistro') dataRegistro: string,
  ) {
    return this.gestaoProdutividadeService.overViewProdutividade(
      centerId,
      processo,
      dataRegistro,
    );
  }

  @Get('get-produtividade-by-id/:idDemanda')
  @ApiOperation({
    summary: 'Buscar a produtividade de uma demanda de produtividade por ID',
    operationId: 'getProdutividadeById',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtividade encontrada com sucesso',
    type: ProdutividadeWithPausaAndPaleteDto,
  })
  getProdutividadeById(@Param('idDemanda') idDemanda: string) {
    return this.gestaoProdutividadeService.getProdutividadeById(idDemanda);
  }

  @Delete('deletar-demanda/:paleteId')
  @ApiOperation({
    summary: 'Deletar uma demanda de produtividade',
    operationId: 'deletarDemanda',
  })
  deletarDemandaController(@Param('paleteId') paleteId: string) {
    return this.gestaoProdutividadeService.deletarDemandaController(paleteId);
  }

  @Delete('deletar-demanda-anomalia/:idDemanda')
  @ApiOperation({
    summary: 'Deletar uma demanda de produtividade por ID',
    operationId: 'deletarDemandaAnomalia',
  })
  deletarDemandaAnomaliaController(@Param('idDemanda') idDemanda: string) {
    return this.gestaoProdutividadeService.deletarDemandaAnomalia(idDemanda);
  }

  @Get('get-demanda-by-id/:idDemanda')
  @ApiOperation({
    summary: 'Buscar uma demanda de produtividade por ID',
    operationId: 'getDemandaById',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda encontrada com sucesso',
    type: DemandaDto,
  })
  getDemandaById(@Param('idDemanda') idDemanda: string) {
    return this.gestaoProdutividadeService.getDemandaById(idDemanda);
  }
}
