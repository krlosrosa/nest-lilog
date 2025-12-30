import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnInfoGeralRavex } from './dto/returnInfoGeralRavex';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { AddDemandaDto } from './dto/demanda/add-demanda.dto';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddNotaDto } from './dto/demanda/add-nota.dto';
import { GetNotasDto } from './dto/demanda/get-notas.dto';
import { ResultadoDemandaDto } from './dto/demanda/resultado-demanda.dto';

@Controller('devolucao')
@ApiTags('devolucao')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class DevolucaoController {
  constructor(private readonly devolucaoService: DevolucaoService) {}

  @Get('info-by-viagem-id/:viagemId')
  @ApiOperation({
    summary: 'Buscar informações da viagem',
    operationId: 'getInfoByViagemId',
  })
  @ApiResponse({
    status: 200,
    description: 'Viagem encontrada com sucesso',
    type: ReturnInfoGeralRavex,
  })
  async getInfoByViagemId(
    @Param('viagemId') viagemId: string,
  ): Promise<ReturnInfoGeralRavex> {
    return this.devolucaoService.getInfoByViagemId(viagemId);
  }

  @Post('add-demanda/:centerId')
  @ApiOperation({
    summary: 'Adicionar demanda',
    operationId: 'addDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda adicionada com sucesso',
    type: String,
  })
  @ApiBody({ type: AddDemandaDto })
  @ApiResponse({
    status: 200,
    description: 'Demanda adicionada com sucesso',
    type: String,
  })
  async addDemanda(
    @Body() addDemandaDto: AddDemandaDto,
    @Param('centerId') centerId: string,
    @AccountId() accountId: string,
  ): Promise<string> {
    return this.devolucaoService.addDemanda(addDemandaDto, centerId, accountId);
  }

  @Get('listar-demandas/:centerId/:data')
  @ApiOperation({
    summary: 'Listar demandas de devolução',
    operationId: 'listarDemandasDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demandas de devolução listadas com sucesso',
    type: [ListarDemandasDto],
  })
  async listarDemandas(
    @Param('centerId') centerId: string,
    @Param('data') data: string,
  ): Promise<ListarDemandasDto[]> {
    return this.devolucaoService.listarDemandas(centerId, data);
  }

  @Get('get-demanda-by-id/:id')
  @ApiOperation({
    summary: 'Buscar demanda de devolução por ID',
    operationId: 'getDemandaByIdDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda de devolução encontrada com sucesso',
    type: ListarDemandasDto,
  })
  async getDemandaById(@Param('id') id: string): Promise<ListarDemandasDto> {
    return this.devolucaoService.getDemandaById(id);
  }

  @Post('add-nota')
  @ApiOperation({
    summary: 'Adicionar nota de devolução',
    operationId: 'addNotaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Nota de devolução adicionada com sucesso',
    type: String,
  })
  @ApiBody({ type: AddNotaDto })
  async addNota(@Body() addNotaDto: AddNotaDto): Promise<void> {
    return this.devolucaoService.addNota(addNotaDto);
  }

  @Get('get-nota-by-nf-and-id-viagem/:nf/:idViagem')
  @ApiOperation({
    summary: 'Buscar nota de devolução por NF e ID da viagem',
    operationId: 'getNotaByNfAndIdViagemDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Nota de devolução encontrada com sucesso',
    type: String,
  })
  async getNotaByNfAndIdViagem(
    @Param('nf') nf: string,
    @Param('idViagem') idViagem: string,
  ): Promise<string | null> {
    return this.devolucaoService.getNotaByNfAndIdViagem(nf, idViagem);
  }

  @Get('get-notas-by-demanda-id/:demandaId')
  @ApiOperation({
    summary: 'Buscar notas de devolução por ID da demanda',
    operationId: 'getNotasByDemandaIdDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Notas de devolução encontradas com sucesso',
    type: [GetNotasDto],
  })
  async getNotasByDemandaId(
    @Param('demandaId') demandaId: string,
  ): Promise<GetNotasDto[]> {
    return this.devolucaoService.getNotasByDemandaId(demandaId);
  }

  @Post('liberar-demanda/:demandaId')
  @ApiOperation({
    summary: 'Liberar demanda para conferência',
    operationId: 'liberarDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda liberada para conferência com sucesso',
    type: String,
  })
  async liberarDemanda(@Param('demandaId') demandaId: string): Promise<void> {
    return this.devolucaoService.liberarDemanda(demandaId);
  }

  @Post('remover-nota/:id')
  @ApiOperation({
    summary: 'Remover nota de devolução',
    operationId: 'removerNotaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Nota de devolução removida com sucesso',
    type: String,
  })
  async removerNota(@Param('id') id: string): Promise<void> {
    return this.devolucaoService.removerNota(id);
  }

  @Delete('deletar-demanda/:id')
  @ApiOperation({
    summary: 'Deletar demanda de devolução',
    operationId: 'deletarDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda de devolução deletada com sucesso',
    type: String,
  })
  async deletarDemanda(@Param('id') id: string): Promise<void> {
    return this.devolucaoService.deletarDemanda(id);
  }

  @Post('reabrir-demanda/:id')
  @ApiOperation({
    summary: 'Reabrir demanda de devolução',
    operationId: 'reabrirDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda de devolução reaberta com sucesso',
    type: String,
  })
  async reabrirDemanda(@Param('id') id: string): Promise<void> {
    return this.devolucaoService.reabrirDemanda(id);
  }

  @Post('finalizar-demanda/:id')
  @ApiOperation({
    summary: 'Finalizar demanda de devolução',
    operationId: 'finalizarDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda de devolução finalizada com sucesso',
    type: String,
  })
  async finalizarDemanda(@Param('id') id: string): Promise<void> {
    return this.devolucaoService.finalizarDemanda(id);
  }

  @Get('get-resultado-demanda/:id')
  @ApiOperation({
    summary: 'Buscar resultado de demanda de devolução',
    operationId: 'getResultadoDemandaDevolucao',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de demanda de devolução encontrado com sucesso',
    type: ResultadoDemandaDto,
  })
  async getResultadoDemanda(
    @Param('id') id: string,
  ): Promise<ResultadoDemandaDto> {
    return this.devolucaoService.getResultadoDemanda(id);
  }
}
