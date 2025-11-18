import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CorteProdutoService } from './corte-produto.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProdutosTransporteDto } from './dto/produtos-transporte.dto';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { CorteMercadoriaDto } from './dto/corte.create.dto';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { FindAllMercadoriaUpdateDto } from './dto/corte.update.dto';
import { CorteMercadoriaGetDto } from './dto/corte.get.dto';

@Controller('corte-produto')
@ApiTags('corte-produto')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class CorteProdutoController {
  constructor(private readonly corteProdutoService: CorteProdutoService) {}

  @Get('/transporte/:centerId/:transporteId')
  @ApiOperation({
    summary: 'Buscar produtos por transporte',
    operationId: 'buscarProdutosPorTransporte',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtos encontrados com sucesso',
    type: [ProdutosTransporteDto],
  })
  async findByTransporte(
    @Param('centerId') centerId: string,
    @Param('transporteId') transporteId: string,
  ) {
    return this.corteProdutoService.findByTransporte(centerId, transporteId);
  }

  @Post(':centerId')
  @ApiOperation({
    summary: 'Criar corte de produto',
    operationId: 'criarCorteDeProduto',
  })
  @ApiBody({ type: [CorteMercadoriaDto] })
  async create(
    @Param('centerId') centerId: string,
    @Body() corteProduto: CorteMercadoriaDto[],
    @AccountId() accountId: string,
  ) {
    return this.corteProdutoService.create(corteProduto, accountId, centerId);
  }

  @Get(':centerId')
  @ApiOperation({
    summary: 'Buscar todos os cortes de produto',
    operationId: 'buscarTodosOsCortesDeProduto',
  })
  @ApiResponse({
    type: [CorteMercadoriaGetDto],
    status: HttpStatus.OK,
    description: 'Cortes de produto encontrados com sucesso',
  })
  async findAll(
    @Param('centerId') centerId: string,
    @Query() params: FindAllMercadoriaUpdateDto,
  ) {
    return this.corteProdutoService.findAll(centerId, params);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Confirmar corte de produto',
    operationId: 'confirmarCorteDeProduto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Corte de produto confirmado com sucesso',
  })
  async confirmarCorte(
    @Param('id') id: string,
    @AccountId() accountId: string,
  ) {
    return this.corteProdutoService.confirmarCorte(id, accountId);
  }

  @Put('/transporte/confirmar/:transporteId')
  @ApiOperation({
    summary: 'Confirmar corte de produto por transporte',
    operationId: 'confirmarCorteDeProdutoPorTransporte',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Corte de produto confirmado com sucesso',
  })
  async confirmarCortePorTransporte(
    @Param('transporteId') transporteId: string,
    @AccountId() accountId: string,
  ) {
    return this.corteProdutoService.confirmarCortePorTransporte(
      transporteId,
      accountId,
    );
  }
}
