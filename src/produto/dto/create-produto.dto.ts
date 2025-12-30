import { ApiProperty } from '@nestjs/swagger';
import { Empresa } from 'src/_shared/enums/produto/empresa';
import { SegmentoProduto } from 'src/_shared/enums/produto/segmentoProduto';
import { TipoPeso } from 'src/_shared/enums/produto/tipoPeso';

export class CreateProdutoDto {
  @ApiProperty({ description: 'Código DUM do produto' })
  codDum?: string;
  @ApiProperty({ description: 'Código EAN do produto' })
  codEan: string;
  @ApiProperty({ description: 'SKU do produto' })
  sku: string;
  @ApiProperty({ description: 'Descrição do produto' })
  descricao: string;
  @ApiProperty({ description: 'Shelf do produto' })
  shelf: number;
  tipoPeso: TipoPeso;
  @ApiProperty({ description: 'Peso líquido da caixa' })
  pesoLiquidoCaixa: string;
  @ApiProperty({ description: 'Peso líquido da unidade' })
  pesoLiquidoUnidade: string;
  @ApiProperty({ description: 'Unidades por caixa' })
  unPorCaixa: number;
  @ApiProperty({ description: 'Caixas por pallet' })
  caixaPorPallet: number;
  @ApiProperty({ description: 'Segmento do produto' })
  segmento: SegmentoProduto;
  @ApiProperty({ description: 'Empresa do produto' })
  empresa: Empresa;
  @ApiProperty({ description: 'Criado em' })
  criadoEm?: string;
}
