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

@UseGuards(AuthGuard)
@Controller('movimentacao')
export class MovimentacaoController {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

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
    console.log({ centerId, criadoPorId });
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
}
