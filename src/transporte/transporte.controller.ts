import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { TransporteService } from './transporte.service';
import { ResultTransporteDto } from './dto/findAll-transporte.dto';
import {
  CreateTransporteDto,
  CreateTransporteItemDto,
} from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { ZodResponse } from 'nestjs-zod';
import { HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllTransportesDto } from './dto/getAllTransportes.dto';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { AddItemsTransporteDto } from './dto/add-items-transporte.dto';
import { ResultadoHoraHoraDto } from './dto/historicoTransporte/resultadoHoraHora.dto';
import { PaleteCreateDataDto } from 'src/gestao-produtividade/dtos/palete/palete.create.dto';
import { TransporteComRelacionamentosGetDto } from './dto/transporte.get.dto';

@Controller('transporte')
@UseGuards(AuthGuard)
@ApiStandardResponses()
@ApiTags('transporte')
export class TransporteController {
  constructor(private readonly transporteService: TransporteService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar transporte em massa',
    operationId: 'criarTransporteEmMassa',
  })
  @ApiBody({
    type: [CreateTransporteItemDto],
  })
  create(
    @Body() createTransporteDto: CreateTransporteDto,
    @AccountId() accountId: string,
  ) {
    return this.transporteService.create(createTransporteDto, accountId);
  }

  @Post('find-all')
  @ApiOperation({
    summary: 'Buscar todos os transportes',
    operationId: 'buscarTodosTransportes',
  })
  @ZodResponse({ type: [ResultTransporteDto], status: HttpStatus.OK })
  findAll(
    @Body() body: GetAllTransportesDto,
    @Query() query: UpdateTransporteDto,
  ) {
    return this.transporteService.findAllWithTransporte(body, query);
  }

  @Get('find-all-without-transporte/:centerId')
  @ApiOperation({
    summary: 'Buscar todos os transportes sem transporte',
    operationId: 'buscarTodosTransportesSemTransporte',
  })
  @ZodResponse({ type: [ResultTransporteDto], status: HttpStatus.OK })
  findAllWithoutTransporte(
    @Query() query: UpdateTransporteDto,
    @Param('centerId') centerId: string,
  ) {
    return this.transporteService.findAllWithoutTransporte(query, centerId);
  }

  @Get('hora-a-hora-transporte/:data/:centerId')
  @ApiOperation({
    summary: 'Buscar a hora a hora de transportes',
    operationId: 'buscarHoraAHoraTransportes',
  })
  @ZodResponse({ type: ResultadoHoraHoraDto, status: HttpStatus.OK })
  horaAHoraTransporte(
    @Param('data') data: string,
    @Param('centerId') centerId: string,
  ) {
    return this.transporteService.horaAHoraTransporte(data, centerId);
  }

  @Post('add-items-to-transporte')
  @ApiOperation({
    summary: 'Adicionar itens a um transporte',
    operationId: 'adicionarItensAoTransporte',
  })
  @ApiBody({ type: [AddItemsTransporteDto] })
  addItemsToTransporte(@Body() body: AddItemsTransporteDto[]) {
    return this.transporteService.addItemsToTransporte(body);
  }

  @Post('add-paletes-in-transporte')
  @ApiOperation({
    summary: 'Adicionar paletes a um transporte',
    operationId: 'adicionarPaletesAoTransporte',
  })
  @ApiBody({ type: [PaleteCreateDataDto] })
  addPaletesInTransporte(
    @Body() body: PaleteCreateDataDto[],
    @AccountId() criadoPorId: string,
  ) {
    return this.transporteService.addPaletesInTransporte(body, criadoPorId);
  }

  @Get('find-by-numero-transporte/:numeroTransporte')
  @ApiOperation({
    summary: 'Buscar transporte por número de transporte',
    operationId: 'buscarTransportePorNumeroTransporte',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transporte encontrado com sucesso',
    type: TransporteComRelacionamentosGetDto,
  })
  findByNumeroTransporte(
    @Param('numeroTransporte') numeroTransporte: string,
  ): Promise<TransporteComRelacionamentosGetDto | null> {
    return this.transporteService.findTransporteByNumeroTransporte(
      numeroTransporte,
    );
  }
}
