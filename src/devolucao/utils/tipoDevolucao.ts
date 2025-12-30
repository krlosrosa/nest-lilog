import { TipoDevolucaoNotas } from 'src/_shared/enums/devolucao/devolucao.type';

export function definirTipoDevolucao(tipo: number): TipoDevolucaoNotas {
  if (tipo === 1) {
    return TipoDevolucaoNotas.DEVOLUCAO;
  }
  if (tipo === 2) {
    return TipoDevolucaoNotas.DEVOLUCAO_PARCIAL;
  }
  if (tipo === 3) {
    return TipoDevolucaoNotas.REENTREGA;
  }
  return TipoDevolucaoNotas.DEVOLUCAO;
}
