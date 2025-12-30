import { Inject, Injectable } from '@nestjs/common';
import { type IRavexRepository } from '../repositories/ravex.repository';
import { ReturnInfoGeralRavex } from '../dto/returnInfoGeralRavex';
import { ProdutoService } from 'src/produto/produto.service';
import { definirTipoDevolucao } from '../utils/tipoDevolucao';
import { converterPesoParaUnidades } from '../utils/converterPesoParaUnidade';
import { verificarDescricaoProduto } from '../utils/verificarDescProduto';
import { verificarEmpresaPorProduto } from '../utils/verificarEmpresaPorProduto';

@Injectable()
export class GetInfoByViagemIdRavex {
  constructor(
    @Inject('IRavexRepository')
    private readonly ravexRepository: IRavexRepository,
    private readonly produtoService: ProdutoService,
  ) {}

  async execute(viagemId: string): Promise<ReturnInfoGeralRavex> {
    const login = 'carlos.rosa@br.lactalis.com';
    const senha = 'MuriloJose@2025';
    const ravex = await this.ravexRepository.authRavex(login, senha);
    const ravexViagem = await this.ravexRepository.getRavexByViagemId(
      viagemId,
      ravex?.access_token || '',
    );

    const ravexViagemGeral = await this.ravexRepository.getRavexViagemId(
      viagemId,
      ravex?.access_token || '',
    );

    const items = ravexViagem?.data.map((item) => item.itens);
    if (items?.length === 0 || !items) {
      throw new Error('Itens não encontrados');
    }

    const skus = items.map((item) => {
      return item.map((item) => item.codigo);
    });

    const skusFlat = skus.flat();

    // remover duplicados
    const skusFlatUnique = [...new Set(skusFlat)] as string[];

    const produtos = await this.produtoService.findOneBySkus(skusFlatUnique);

    if (!ravexViagem) {
      throw new Error('Ravex viagem não encontrado');
    }

    if (!ravexViagemGeral) {
      throw new Error('Ravex viagem geral não encontrado');
    }

    return {
      idViagem: viagemId,
      motorista: ravexViagemGeral.data.motorista?.nome || '',
      placa: ravexViagemGeral.data.veiculo?.placa || '',
      transportadora: ravexViagemGeral.data.transportadora?.nome || '',
      notas: ravexViagem.data.map((item) => ({
        tipo: definirTipoDevolucao(Number(item.tipoRetorno)),
        notaFiscal: item.numeroNotaFiscal,
        notaFiscalParcial: null,
        motivoDevolucao: item.motivo.codigo,
        descMotivoDevolucao: item.motivo.descricao,
        operador: item.operador?.nome,
        empresa: verificarEmpresaPorProduto(item.itens[0].codigo, produtos),
        itens: item.itens.map((item) => {
          const converter = converterPesoParaUnidades(
            item.codigo,
            item.pesoLiquidoDevolvido,
            produtos,
          );
          return {
            sku: item.codigo,
            descricao: verificarDescricaoProduto(item.codigo, produtos),
            pesoLiquido: item.pesoLiquidoDevolvido,
            quantidadeRavex: item.quantidadeDevolvida,
            quantidadeCaixas: converter.caixas,
            quantidadeUnidades: converter.unidades,
            fatorConversao: converter.fatorConversao,
            unPorCaixa: converter.unPorCaixa,
            decimal: converter.decimal,
          };
        }),
      })),
    };
  }
}
