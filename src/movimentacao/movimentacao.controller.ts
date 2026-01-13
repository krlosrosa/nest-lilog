import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { UpdateMovimentacaoDto } from './dto/update-movimentacao.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetMovimentacaoDto } from './dto/get-movimentacao.dto';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ContagemService } from './contagem.service';
import { CreateContagemDto } from './dto/contagem/create-contagem.dto';
import { GetContagemDto } from './dto/contagem/get-contagem.dto';
import { CreateAnomaliaContagemLiteDto } from './dto/contagem/create-anomalia-validacao.dto';
import { ResumoContagemLiteDto } from './dto/contagem/resumo-contamge.dto';
import { GetAnomaliaContagemDto } from './dto/contagem/get-anomalia-contagem.dto';

@UseGuards(AuthGuard)
@Controller('movimentacao')
export class MovimentacaoController {
  constructor(
    private readonly movimentacaoService: MovimentacaoService,
    private readonly contagemService: ContagemService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma movimentação',
    operationId: 'criarNovaMovimentacao',
  })
  @ApiBody({
    type: [CreateMovimentacaoDto],
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentação criada com sucesso',
    type: GetMovimentacaoDto,
  })
  create(@Body() createMovimentacaoDto: CreateMovimentacaoDto[]) {
    return this.movimentacaoService.create(createMovimentacaoDto);
  }

  @Get('/pending/:centerId')
  @ApiOperation({
    summary: 'Buscar todas as movimentações pendentes',
    operationId: 'findAllPending',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentações pendentes encontradas com sucesso',
    type: [GetMovimentacaoDto],
  })
  findAllPending(@Param('centerId') centerId: string) {
    return this.movimentacaoService.findAllPeding(centerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimentacaoService.findOne(+id);
  }

  @Get('/next/:centerId')
  @ApiOperation({
    summary: 'Buscar a próxima movimentação pendente',
    operationId: 'getNextMovimentacao',
  })
  @ApiResponse({
    status: 200,
    description: 'Próxima movimentação pendente encontrada com sucesso',
    type: GetMovimentacaoDto,
  })
  getNextMovimentacao(
    @Param('centerId') centerId: string,
    @AccountId() criadoPorId: string,
  ) {
    return this.movimentacaoService.getNextMovimentacao(centerId, criadoPorId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar uma movimentação',
    operationId: 'updateMovimentacao',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentação atualizada com sucesso',
    type: Boolean,
  })
  @ApiParam({
    name: 'id',
    description: 'ID da movimentação',
    type: Number,
  })
  @ApiBody({
    type: UpdateMovimentacaoDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateMovimentacaoDto: UpdateMovimentacaoDto,
  ) {
    return this.movimentacaoService.update(+id, updateMovimentacaoDto);
  }

  @Put(':id/validate')
  @ApiOperation({
    summary: 'Validar uma movimentação',
    operationId: 'validateMovimentacao',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentação validada com sucesso',
    type: Boolean,
  })
  validateMovimentacao(
    @Param('id') id: string,
    @AccountId() executadoPorId: string,
  ) {
    return this.movimentacaoService.validateMovimentacao(+id, executadoPorId);
  }

  @Put(':id/anomalia')
  @ApiOperation({
    summary: 'Cadastrar uma anomalia',
    operationId: 'cadastrarAnomalia',
  })
  @ApiResponse({
    status: 200,
    description: 'Anomalia cadastrada com sucesso',
    type: Boolean,
  })
  cadastrarAnomalia(@Param('id') id: string, @AccountId() criadoPorId: string) {
    return this.movimentacaoService.cadastrarAnomalia(+id, criadoPorId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover uma movimentação',
    operationId: 'removerMovimentacao',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentação removida com sucesso',
    type: Boolean,
  })
  @ApiParam({
    name: 'id',
    description: 'ID da movimentação',
    type: Number,
  })
  remove(@Param('id') id: number) {
    return this.movimentacaoService.remove(+id);
  }

  @Put(':id/start')
  @ApiOperation({
    summary: 'Registrar o início de uma movimentação',
    operationId: 'registerStartMovement',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimentação iniciada com sucesso',
    type: Boolean,
  })
  registerStartMovement(@Param('id') id: number) {
    return this.movimentacaoService.registerStartMovement(+id);
  }

  @Post('add-contagem-lite')
  @ApiOperation({
    summary: 'Adicionar uma contagem lite validation',
    operationId: 'addContagemLiteValidation',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem lite validation adicionada com sucesso',
    type: Boolean,
  })
  @ApiBody({
    type: [CreateContagemDto],
  })
  addContagemLiteValidation(@Body() createContagemDto: CreateContagemDto[]) {
    return this.contagemService.create(createContagemDto);
  }

  @Get('get-endereco/:endereco')
  @ApiOperation({
    summary: 'Buscar uma contagem lite validation por endereço',
    operationId: 'getEndereco',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem lite validation encontrada com sucesso',
    type: [GetContagemDto],
  })
  @ApiParam({
    name: 'endereco',
    description: 'Endereço da contagem lite validation',
    type: String,
  })
  getEndereco(@Param('endereco') endereco: string) {
    return this.contagemService.getEndereco(endereco);
  }

  @Put('validar-endereco/:endereco/:centerId')
  @ApiOperation({
    summary: 'Validar um endereço',
    operationId: 'validarEndereco',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço validado com sucesso',
    type: Boolean,
  })
  @ApiParam({
    name: 'endereco',
    description: 'Endereço da contagem lite validation',
    type: String,
  })
  validarEndereco(
    @Param('endereco') endereco: string,
    @Param('centerId') centerId: string,
    @AccountId() contadoPor: string,
  ) {
    return this.contagemService.validarEndereco(endereco, centerId, contadoPor);
  }

  @Post('add-anomalia-contagem-lite/:centerId/:endereco')
  @ApiOperation({
    summary: 'Adicionar uma anomalia contagem lite',
    operationId: 'addAnomaliaContagemLite',
  })
  @ApiResponse({
    status: 200,
    description: 'Anomalia contagem lite adicionada com sucesso',
    type: Boolean,
  })
  @ApiBody({
    type: CreateAnomaliaContagemLiteDto,
  })
  addAnomaliaContagemLite(
    @Body() createAnomaliaContagemLiteDto: CreateAnomaliaContagemLiteDto,
    @Param('centerId') centerId: string,
    @Param('endereco') endereco: string,
    @AccountId() cadastradoPor: string,
  ) {
    return this.movimentacaoService.addAnomaliaContagemLite(
      centerId,
      endereco,
      cadastradoPor,
      createAnomaliaContagemLiteDto,
    );
  }

  @Get('resumo-contagem-lite/:centerId')
  @ApiOperation({
    summary: 'Buscar o resumo da contagem lite',
    operationId: 'resumoContagemLite',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo da contagem lite encontrado com sucesso',
    type: [ResumoContagemLiteDto],
  })
  @ApiParam({
    name: 'centerId',
    description: 'ID do centro',
    type: String,
  })
  resumoContagemLite(@Param('centerId') centerId: string) {
    return this.contagemService.resumoContagemLite(centerId);
  }

  @Delete('delete-contagem-lite/:centerId')
  @ApiOperation({
    summary: 'Deletar a contagem lite',
    operationId: 'deleteContagemLite',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem lite deletada com sucesso',
    type: Boolean,
  })
  @ApiParam({
    name: 'centerId',
    description: 'ID do centro',
    type: String,
  })
  deleteContagemLite(@Param('centerId') centerId: string) {
    return this.contagemService.deleteContagemLite(centerId);
  }

  @Get('relatorio-anomalias-contagem-lite/:centerId/:dataReferencia')
  @ApiOperation({
    summary: 'Buscar o relatorio de anomalias da contagem lite',
    operationId: 'relatorioAnomaliasContagemLite',
  })
  @ApiResponse({
    status: 200,
    description:
      'Relatorio de anomalias da contagem lite encontrado com sucesso',
    type: [GetAnomaliaContagemDto],
  })
  @ApiParam({
    name: 'centerId',
    description: 'ID do centro',
    type: String,
  })
  @ApiParam({
    name: 'dataReferencia',
    description: 'Data de referencia',
    type: String,
  })
  relatorioAnomaliasContagemLite(
    @Param('centerId') centerId: string,
    @Param('dataReferencia') dataReferencia: string,
  ) {
    return this.contagemService.relatorioAnomaliasContagemLite(
      centerId,
      dataReferencia,
    );
  }
}
