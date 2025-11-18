import { TransporteGetData } from '../dto/transporte.get.dto';

type Palete = {
  id: string;
  empresa: string;
  quantidadeCaixas: number;
  quantidadeUnidades: number;
  quantidadePaletes: number;
  enderecoVisitado: number;
  segmento: string;
  transporteId: string;
  tipoProcesso: 'SEPARACAO' | 'CARREGAMENTO' | 'CONFERENCIA';
  criadoEm: string;
  atualizadoEm: string;
  demandaId: number | null;
  status: 'EM_PROGRESSO' | 'NAO_INICIADO' | 'CONCLUIDO' | 'EM_PAUSA';
  validado: boolean;
  criadoPorId: string;
  inicio: string | null;
  fim: string | null;
};

type Registro = {
  Transporte: Omit<TransporteGetData, 'paletes'>;
  Palete: Palete | null;
};

export function agruparTransportesComRelacionamentos(registros: Registro[]) {
  const mapa = new Map<string, TransporteGetData & { paletes: Palete[] }>();

  for (const item of registros) {
    const { Transporte, Palete } = item;

    if (!mapa.has(Transporte.numeroTransporte)) {
      mapa.set(Transporte.numeroTransporte, { ...Transporte, paletes: [] });
    }

    const transporte = mapa.get(Transporte.numeroTransporte)!;

    if (Palete && !transporte.paletes.some((p) => p.id === Palete.id)) {
      transporte.paletes.push(Palete);
    }
  }

  return Array.from(mapa.values());
}
