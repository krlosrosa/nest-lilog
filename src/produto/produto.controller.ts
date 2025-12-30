import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produto')
@ApiTags('produto')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo produto',
    operationId: 'createProduto',
  })
  @ApiBody({ type: CreateProdutoDto })
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<void> {
    return this.produtoService.create(createProdutoDto);
  }

  @Post('many')
  @ApiOperation({
    summary: 'Criar múltiplos produtos',
    operationId: 'createManyProdutos',
  })
  @ApiBody({ type: [CreateProdutoDto] })
  async createMany(
    @Body() createProdutoDto: CreateProdutoDto[],
  ): Promise<void> {
    await this.produtoService.createMany(createProdutoDto);
    return;
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar todos os produtos',
    operationId: 'findAllProdutos',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtos encontrados com sucesso',
    type: [CreateProdutoDto],
  })
  async findAll(): Promise<CreateProdutoDto[]> {
    return this.produtoService.findAll();
  }

  @Get(':sku')
  @ApiOperation({
    summary: 'Buscar um produto pelo SKU',
    operationId: 'findProdutoBySku',
  })
  async findOne(@Param('sku') sku: string): Promise<CreateProdutoDto | null> {
    const produto = await this.produtoService.findOne(sku);
    if (!produto) return null;
    return produto;
  }

  @Put(':sku')
  @ApiOperation({
    summary: 'Atualizar um produto pelo SKU',
    operationId: 'updateProdutoBySku',
  })
  async update(
    @Param('sku') sku: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<void> {
    return this.produtoService.update(sku, updateProdutoDto);
  }

  @Delete(':sku')
  @ApiOperation({
    summary: 'Deletar um produto pelo SKU',
    operationId: 'deleteProdutoBySku',
  })
  async delete(@Param('sku') sku: string): Promise<void> {
    return this.produtoService.delete(sku);
  }
}
