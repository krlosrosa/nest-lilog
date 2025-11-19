type Demanda = {
  id: number;
  processo: 'SEPARACAO' | 'CARREGAMENTO' | 'CONFERENCIA';
  inicio: string;
  fim: string | null;
  status: 'EM_PROGRESSO' | 'FINALIZADA' | 'PAUSA' | 'CANCELADA';
  cadastradoPorId: string;
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTERMEDIARIO' | 'ADMINISTRATIVO';
  funcionarioId: string;
  criadoEm: string;
  centerId: string;
  obs: string | null;
  dataExpedicao: string;
};

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
  totalCaixas: number;
  pesoLiquido: number;
};

type Pausa = {
  id: number;
  inicio: string;
  fim: string | null;
  motivo: string;
  descricao: string | null;
  demandaId: number;
  registradoPorId: string;
  pausaGeralId: number | null;
};

type User = {
  id: string;
  name: string;
  password: string | null;
  centerId: string;
  token: string | null;
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTERMEDIARIO' | 'ADMINISTRATIVO';
  resetSenha: boolean;
  empresa: string;
};

type Registro = {
  Demanda: Demanda;
  Palete: Palete | null;
  Pausa: Pausa | null;
  User: User | null;
};

/**
 * Normaliza uma string de data do formato PostgreSQL para ISO
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

  // Se está no formato PostgreSQL ('YYYY-MM-DD HH:mm:ss.sss'), converte para ISO
  // Substitui espaço por 'T' e adiciona 'Z' para UTC
  return dateStr.replace(' ', 'T') + 'Z';
}

/**
 * Normaliza os campos de data de uma Demanda
 */
function normalizeDemandaDates(demanda: Demanda): Demanda {
  const inicioNormalized = normalizeDateString(demanda.inicio);
  const criadoEmNormalized = normalizeDateString(demanda.criadoEm);
  const dataExpedicaoNormalized = normalizeDateString(demanda.dataExpedicao);

  return {
    ...demanda,
    inicio: inicioNormalized || demanda.inicio,
    fim: normalizeDateString(demanda.fim),
    criadoEm: criadoEmNormalized || demanda.criadoEm,
    dataExpedicao: dataExpedicaoNormalized || demanda.dataExpedicao,
  };
}

/**
 * Normaliza os campos de data de um Palete
 */
function normalizePaleteDates(palete: Palete): Palete {
  const criadoEmNormalized = normalizeDateString(palete.criadoEm);
  const atualizadoEmNormalized = normalizeDateString(palete.atualizadoEm);

  return {
    ...palete,
    inicio: normalizeDateString(palete.inicio),
    fim: normalizeDateString(palete.fim),
    criadoEm: criadoEmNormalized || palete.criadoEm,
    atualizadoEm: atualizadoEmNormalized || palete.atualizadoEm,
  };
}

/**
 * Normaliza os campos de data de uma Pausa
 */
function normalizePausaDates(pausa: Pausa): Pausa {
  const inicioNormalized = normalizeDateString(pausa.inicio);

  return {
    ...pausa,
    inicio: inicioNormalized || pausa.inicio,
    fim: normalizeDateString(pausa.fim),
  };
}

export function agruparDemandasComRelacionamentos(registros: Registro[]) {
  const mapa = new Map<
    number,
    Demanda & { paletes: Palete[]; pausas: Pausa[]; funcionario: User | null }
  >();

  for (const item of registros) {
    const { Demanda, Palete, Pausa, User } = item;

    // Normaliza os dados antes de processar
    const demandaNormalizada = normalizeDemandaDates(Demanda);
    const paleteNormalizado = Palete ? normalizePaleteDates(Palete) : null;
    const pausaNormalizada = Pausa ? normalizePausaDates(Pausa) : null;

    if (!mapa.has(demandaNormalizada.id)) {
      mapa.set(demandaNormalizada.id, {
        ...demandaNormalizada,
        paletes: [],
        pausas: [],
        funcionario: User,
      });
    }

    const demanda = mapa.get(demandaNormalizada.id)!;

    if (
      paleteNormalizado &&
      !demanda.paletes.some((p) => p.id === paleteNormalizado.id)
    ) {
      demanda.paletes.push(paleteNormalizado);
    }

    if (
      pausaNormalizada &&
      !demanda.pausas.some((p) => p.id === pausaNormalizada.id)
    ) {
      demanda.pausas.push(pausaNormalizada);
    }
  }

  return Array.from(mapa.values());
}
