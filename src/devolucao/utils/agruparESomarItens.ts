import { EntradaDto } from '../dto/mobile/itensContabil.dto';

export function agruparPorTipoSkuEDevolucao(itens: EntradaDto[]): Agrupado[] {
  return Object.values(
    itens.reduce(
      (acc, item) => {
        const chave = `${item.tipo}_${item.sku}_${item.tipoDevolucao}`;

        if (!acc[chave]) {
          acc[chave] = {
            demandaId: item.demandaId,
            sku: item.sku,
            tipo: item.tipo,
            descricao: item.descricao,
            quantidadeCaixas: 0,
            quantidadeUnidades: 0,
            avariaCaixas: 0,
            avariaUnidades: 0,
            tipoDevolucao: item.tipoDevolucao,
          };
        }

        acc[chave].quantidadeCaixas += item.quantidadeCaixas ?? 0;
        acc[chave].quantidadeUnidades += item.quantidadeUnidades ?? 0;
        acc[chave].avariaCaixas += item.avariaCaixas ?? 0;
        acc[chave].avariaUnidades += item.avariaUnidades ?? 0;

        return acc;
      },
      {} as Record<string, Agrupado>,
    ),
  );
}

export type Agrupado = {
  demandaId: number;
  sku: string;
  tipo: 'CONTABIL' | 'FISICO';
  tipoDevolucao: 'RETORNO' | 'REENTREGA';
  quantidadeCaixas: number;
  quantidadeUnidades: number;
  avariaCaixas: number;
  avariaUnidades: number;
  descricao: string;
};
