import {
  and,
  count,
  eq,
  exists,
  gte,
  inArray,
  lte,
  or,
  sum,
} from 'drizzle-orm';
import { DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  dashboardProdutividadeCenter,
  demanda,
  palete,
  transporte,
} from 'src/_shared/infra/drizzle/migrations/schema';
import { DemandaProcesso, DemandaStatus } from 'src/_shared/enums';

export async function overViewProdutividadeQuery(
  db: DrizzleClient,
  centerId: string,
  processo: DemandaProcesso,
  dataRegistro: string,
) {
  // Converte a data recebida para o início do dia (00:00:00.000)
  const inicioDia = new Date(dataRegistro);
  inicioDia.setUTCHours(0, 0, 0, 0);

  const fimDia = new Date(dataRegistro);
  fimDia.setUTCHours(23, 59, 59, 999);

  // Construção das condições de filtro (todos obrigatórios)
  const demandaWhereClause = and(
    eq(demanda.centerId, centerId),
    eq(demanda.processo, processo),
    exists(
      db
        .select()
        .from(palete)
        .innerJoin(
          transporte,
          eq(palete.transporteId, transporte.numeroTransporte),
        )
        .where(
          and(
            eq(palete.demandaId, demanda.id),
            gte(transporte.dataExpedicao, inicioDia.toISOString()),
            lte(transporte.dataExpedicao, fimDia.toISOString()),
          ),
        ),
    ),
  );

  // Query para contar demandas concluídas
  const concluidosResult = await db
    .select({ count: count() })
    .from(demanda)
    .where(
      and(demandaWhereClause, eq(demanda.status, DemandaStatus.FINALIZADA)),
    );

  // Query para contar demandas em andamento (EM_PROGRESSO ou PAUSA)
  const emAndamentoResult = await db
    .select({ count: count() })
    .from(demanda)
    .where(
      and(
        demandaWhereClause,
        or(
          eq(demanda.status, DemandaStatus.EM_PROGRESSO),
          eq(demanda.status, DemandaStatus.PAUSA),
        ),
      ),
    );

  // Query para somar caixas e unidades dos paletes relacionados às demandas filtradas
  const paletesResult = await db
    .select({
      totalCaixas: sum(palete.quantidadeCaixas),
      totalUnidades: sum(palete.quantidadeUnidades),
    })
    .from(palete)
    .where(
      inArray(
        palete.demandaId,
        db.select({ id: demanda.id }).from(demanda).where(demandaWhereClause),
      ),
    );

  // Query para contar processos distintos
  const processosResult = await db
    .select({ count: count() })
    .from(demanda)
    .where(demandaWhereClause);

  // Query para buscar produtividade da tabela dashboardProdutividadeCenter
  // Filtra por centerId, processo e dataRegistro (dentro do dia)
  const totaisResult = await db
    .select({
      // Peça a soma total de caixas
      totalCaixas: sum(dashboardProdutividadeCenter.totalCaixas),
      // Peça a soma total de tempo
      totalTempo: sum(dashboardProdutividadeCenter.totalTempoTrabalhado),
    })
    .from(dashboardProdutividadeCenter)
    .where(
      and(
        eq(dashboardProdutividadeCenter.centerId, centerId),
        eq(dashboardProdutividadeCenter.processo, processo),
        gte(dashboardProdutividadeCenter.dataRegistro, inicioDia.toISOString()),
        lte(dashboardProdutividadeCenter.dataRegistro, fimDia.toISOString()),
      ),
    );

  return {
    concluidos: concluidosResult[0]?.count ?? 0,
    emAndamento: emAndamentoResult[0]?.count ?? 0,
    totalCaixas: Number(paletesResult[0]?.totalCaixas ?? 0),
    totalUnidades: Number(paletesResult[0]?.totalUnidades ?? 0),
    produtividade:
      Number(totaisResult[0]?.totalCaixas ?? 0) /
        (Number(totaisResult[0]?.totalTempo ?? 0) / 3600000.0) || 0,
    processos: processosResult[0]?.count ?? 0,
  };
}
