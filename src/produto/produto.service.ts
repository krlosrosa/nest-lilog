import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { produto } from 'src/_shared/infra/drizzle';
import { eq, inArray } from 'drizzle-orm';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { TipoPeso } from 'src/_shared/enums/produto/tipoPeso';
import { Empresa } from 'src/_shared/enums/produto/empresa';
import { SegmentoProduto } from 'src/_shared/enums/produto/segmentoProduto';

@Injectable()
export class ProdutoService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async createMany(createProdutoDto: CreateProdutoDto[]): Promise<void> {
    const produtoData = createProdutoDto.map((produto) => ({
      ...produto,
      updatedAt: new Date().toISOString(),
    }));
    await this.db.insert(produto).values(produtoData);
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<void> {
    const produtoData = {
      ...createProdutoDto,
      updatedAt: new Date().toISOString(),
    };
    await this.db.insert(produto).values(produtoData);
  }

  async update(sku: string, updateProdutoDto: UpdateProdutoDto): Promise<void> {
    const produtoData = {
      ...updateProdutoDto,
      updatedAt: new Date().toISOString(),
    };
    await this.db.update(produto).set(produtoData).where(eq(produto.sku, sku));
  }

  async delete(sku: string): Promise<void> {
    await this.db.delete(produto).where(eq(produto.sku, sku));
  }

  async findAll(): Promise<CreateProdutoDto[]> {
    const produtos = await this.db.select().from(produto);
    const produtoData = produtos.map((produto) => ({
      ...produto,
      codDum: produto.codDum ?? undefined,
      tipoPeso: produto.tipoPeso as TipoPeso,
      pesoLiquidoCaixa: produto.pesoLiquidoCaixa.toString(),
      pesoLiquidoUnidade: produto.pesoLiquidoUnidade.toString(),
      unPorCaixa: produto.unPorCaixa,
      caixaPorPallet: produto.caixaPorPallet,
      segmento: produto.segmento as SegmentoProduto,
      empresa: produto.empresa as Empresa,
      codEan: produto.codEan ?? '',
    }));
    return produtoData;
  }

  async findOne(sku: string): Promise<CreateProdutoDto | undefined> {
    const produtoResult = await this.db
      .select()
      .from(produto)
      .where(eq(produto.sku, sku))
      .limit(1);
    if (!produtoResult) return undefined;
    return {
      ...produtoResult[0],
      codDum: produtoResult[0].codDum ?? undefined,
      tipoPeso: produtoResult[0].tipoPeso as TipoPeso,
      pesoLiquidoCaixa: produtoResult[0].pesoLiquidoCaixa.toString(),
      pesoLiquidoUnidade: produtoResult[0].pesoLiquidoUnidade.toString(),
      unPorCaixa: produtoResult[0].unPorCaixa,
      caixaPorPallet: produtoResult[0].caixaPorPallet,
      segmento: produtoResult[0].segmento as SegmentoProduto,
      empresa: produtoResult[0].empresa as Empresa,
      codEan: produtoResult[0].codEan ?? '',
    };
  }

  async findOneBySkus(skus: string[]): Promise<CreateProdutoDto[]> {
    const produtos = await this.db
      .select()
      .from(produto)
      .where(inArray(produto.sku, skus));
    return produtos.map((produto) => ({
      ...produto,
      codDum: produto.codDum ?? undefined,
      tipoPeso: produto.tipoPeso as TipoPeso,
      pesoLiquidoCaixa: produto.pesoLiquidoCaixa.toString(),
      pesoLiquidoUnidade: produto.pesoLiquidoUnidade.toString(),
      unPorCaixa: produto.unPorCaixa,
      caixaPorPallet: produto.caixaPorPallet,
      segmento: produto.segmento as SegmentoProduto,
      empresa: produto.empresa as Empresa,
      codEan: produto.codEan ?? '',
    }));
  }
}
