import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { UpdateMovimentacaoDto } from './dto/update-movimentacao.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMovimentacaoDto } from './dto/get-movimentacao.dto';

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
  getNextMovimentacao(@Param('centerId') centerId: string) {
    return this.movimentacaoService.getNextMovimentacao(centerId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
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
  validateMovimentacao(@Param('id') id: string) {
    return this.movimentacaoService.validateMovimentacao(+id, '421931');
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
  cadastrarAnomalia(@Param('id') id: string) {
    return this.movimentacaoService.cadastrarAnomalia(+id, '421931');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimentacaoService.remove(+id);
  }
}
