import { TransporteComRelacionamentosGetDto } from '../dto/transporte.get.dto';

// Tipos genéricos para os relacionamentos (aceitam qualquer estrutura do Drizzle)
type Palete = Record<string, any> & { id: string };
type CorteMercadoria = Record<string, any> & { id: number };
type HistoricoStatusTransporte = Record<string, any> & { id: number };
type ImpressaoMapa = Record<string, any> & { id: number };

/**
 * Normaliza uma string de data do formato PostgreSQL para ISO UTC
 * Converte 'YYYY-MM-DD HH:mm:ss.sss' para 'YYYY-MM-DDTHH:mm:ss.sssZ'
 * Se já estiver em formato ISO, retorna como está
 */
function normalizeDateString(dateStr: string | null): string | null {
  if (!dateStr) {
    return null;
  }

  // Se já está em formato ISO (tem 'T' ou 'Z'), retorna como está
  if (dateStr.includes('T') || dateStr.includes('Z')) {
    return dateStr;
  }

  // Se está no formato PostgreSQL ('YYYY-MM-DD HH:mm:ss.sss'), converte para ISO UTC
  // Substitui espaço por 'T' e adiciona 'Z' para UTC
  return dateStr.replace(' ', 'T') + 'Z';
}

/**
 * Normaliza os campos de data de um Transporte
 */
function normalizeTransporteDates(transporte: any): any {
  return {
    ...transporte,
    criadoEm: normalizeDateString(transporte.criadoEm) || transporte.criadoEm,
    atualizadoEm:
      normalizeDateString(transporte.atualizadoEm) || transporte.atualizadoEm,
    dataExpedicao:
      normalizeDateString(transporte.dataExpedicao) || transporte.dataExpedicao,
  };
}

/**
 * Normaliza os campos de data de um Palete
 */
function normalizePaleteDates(palete: Palete): Palete {
  return {
    ...palete,
    criadoEm: normalizeDateString(palete.criadoEm) || palete.criadoEm,
    atualizadoEm:
      normalizeDateString(palete.atualizadoEm) || palete.atualizadoEm,
    inicio: normalizeDateString(palete.inicio),
    fim: normalizeDateString(palete.fim),
  };
}

/**
 * Normaliza os campos de data de um CorteMercadoria
 */
function normalizeCorteMercadoriaDates(
  corte: CorteMercadoria,
): CorteMercadoria {
  return {
    ...corte,
    criadoEm: normalizeDateString(corte.criadoEm) || corte.criadoEm,
    atualizadoEm: normalizeDateString(corte.atualizadoEm) || corte.atualizadoEm,
  };
}

/**
 * Normaliza os campos de data de um HistoricoStatusTransporte
 */
function normalizeHistoricoStatusTransporteDates(
  historico: HistoricoStatusTransporte,
): HistoricoStatusTransporte {
  return {
    ...historico,
    alteradoEm:
      normalizeDateString(historico.alteradoEm) || historico.alteradoEm,
  };
}

/**
 * Normaliza os campos de data de um ImpressaoMapa
 */
function normalizeImpressaoMapaDates(impressao: ImpressaoMapa): ImpressaoMapa {
  return {
    ...impressao,
    impressoEm:
      normalizeDateString(impressao.impressoEm) || impressao.impressoEm,
  };
}

export function agruparTransporteComTodosRelacionamentos(
  registros: any[],
): TransporteComRelacionamentosGetDto | null {
  if (!registros || registros.length === 0) {
    return null;
  }

  // Como estamos buscando por um único transporte, todos os registros pertencem ao mesmo transporte
  const primeiroRegistro = registros[0];
  const { Transporte } = primeiroRegistro;

  // Normaliza as datas do transporte
  const transporteNormalizado = normalizeTransporteDates(Transporte);

  // Inicializa arrays para os relacionamentos
  const paletes: Palete[] = [];
  const cortes: CorteMercadoria[] = [];
  const historicoTransporte: HistoricoStatusTransporte[] = [];
  const impressaoMapa: ImpressaoMapa[] = [];

  // Usa Sets para evitar duplicatas
  const paletesIds = new Set<string>();
  const cortesIds = new Set<number>();
  const historicoIds = new Set<number>();
  const impressaoIds = new Set<number>();

  // Coleta todos os relacionamentos únicos
  for (const item of registros) {
    const {
      Palete,
      CorteMercadoria,
      HistoricoStatusTransporte,
      HistoricoImpressaoMapa,
    } = item;

    if (Palete && !paletesIds.has(Palete.id)) {
      paletes.push(normalizePaleteDates(Palete));
      paletesIds.add(Palete.id);
    }

    if (CorteMercadoria && !cortesIds.has(CorteMercadoria.id)) {
      cortes.push(normalizeCorteMercadoriaDates(CorteMercadoria));
      cortesIds.add(CorteMercadoria.id);
    }

    if (
      HistoricoStatusTransporte &&
      !historicoIds.has(HistoricoStatusTransporte.id)
    ) {
      historicoTransporte.push(
        normalizeHistoricoStatusTransporteDates(HistoricoStatusTransporte),
      );
      historicoIds.add(HistoricoStatusTransporte.id);
    }

    if (
      HistoricoImpressaoMapa &&
      !impressaoIds.has(HistoricoImpressaoMapa.id)
    ) {
      impressaoMapa.push(normalizeImpressaoMapaDates(HistoricoImpressaoMapa));
      impressaoIds.add(HistoricoImpressaoMapa.id);
    }
  }

  // Retorna o objeto no formato esperado
  return {
    ...transporteNormalizado,
    paletes,
    cortes,
    historicoTransporte,
    impressaoMapa,
  } as TransporteComRelacionamentosGetDto;
}
