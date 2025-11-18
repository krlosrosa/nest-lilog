import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/_shared/infra/redis/redis.service';
import { ProdutosTransporteData } from './dto/produtos-transporte.dto';
import { type ICorteProdutoRepository } from './domain/repositories/ICorteProduto.repository';
import { CorteMercadoriaDto } from './dto/corte.create.dto';
import { FindAllMercadoriaUpdateDto } from './dto/corte.update.dto';
import { CorteMercadoriaGetDto } from './dto/corte.get.dto';

@Injectable()
export class CorteProdutoService {
  constructor(
    @Inject('ICorteProdutoRepository')
    private readonly corteProdutoRepository: ICorteProdutoRepository,
    private readonly redis: RedisService,
  ) {}

  async findByTransporte(
    centerId: string,
    transporteId: string,
  ): Promise<ProdutosTransporteData[]> {
    let transporte: string = transporteId;

    if (transporteId.length > 10) {
      const result =
        await this.corteProdutoRepository.findTransporteByPaleteId(
          transporteId,
        );
      if (!result) {
        throw new NotFoundException('Transporte não encontrado');
      }
      transporte = result;
    }

    const produtosRedis = await this.redis.get(`transporte:${transporte}`);
    const produtos: ProdutosTransporteData[] = produtosRedis
      ? JSON.parse(produtosRedis)
      : [];

    const produtosBanco = await this.findAll(centerId, {
      transporteId: transporte,
    });

    const resultadoProdutos: ProdutosTransporteData[] = produtos.map(
      (produto) => {
        const produtosBancoFiltrados = produtosBanco.filter(
          (p) => p.produto === produto.sku && p.lote === produto.lote,
        );
        const quantidade = produtosBancoFiltrados.reduce(
          (acc, curr) => acc + curr.unidades,
          0,
        );
        const caixas = produtosBancoFiltrados.reduce(
          (acc, curr) => acc + curr.caixas,
          0,
        );
        return {
          ...produto,
          quantidadeCortada: quantidade,
          caixasCortadas: caixas,
        };
      },
    );

    return resultadoProdutos;

    /*if (transporteId.length > 10) {
      const transporte =
        await this.corteProdutoRepository.findTransporteByPaleteId(
          transporteId,
        );
      if (!transporte) {
        throw new NotFoundException('Transporte não encontrado');
      }
      const produtos = await this.redis.get(`transporte:${transporte}`);
      return produtos ? JSON.parse(produtos) : [];
    }
    const produtos = await this.redis.get(`transporte:${transporteId}`);
    return produtos ? JSON.parse(produtos) : [];
    */
  }

  async create(
    corteProduto: CorteMercadoriaDto[],
    criadoPorId: string,
    centerId: string,
  ): Promise<void> {
    await this.corteProdutoRepository.create(
      corteProduto,
      criadoPorId,
      centerId,
    );
  }

  async findAll(
    centerId: string,
    params: FindAllMercadoriaUpdateDto,
  ): Promise<CorteMercadoriaGetDto[]> {
    return this.corteProdutoRepository.findAll(centerId, params);
  }

  async confirmarCorte(id: string, confirmadoPorId: string): Promise<void> {
    await this.corteProdutoRepository.confirmarCorte(id, confirmadoPorId);
  }

  async confirmarCortePorTransporte(
    transporteId: string,
    confirmadoPorId: string,
  ): Promise<void> {
    await this.corteProdutoRepository.confirmarCortePorTransporte(
      transporteId,
      confirmadoPorId,
    );
  }
}
