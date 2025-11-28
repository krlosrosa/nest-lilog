import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { eq, and, SQL, count, sql, gte, lte } from 'drizzle-orm';
import { ResultTransporteDto } from 'src/transporte/dto/findAll-transporte.dto';
import { UpdateTransporteDto } from 'src/transporte/dto/update-transporte.dto';
import {
  historicoImpressaoMapa,
  transporte,
} from 'src/_shared/infra/drizzle/migrations/schema';

// 1. Defina o DTO (interface) dos filtros que esta query aceita
export interface FindAllCentersQueryDto {
  centerId?: string;
  state?: string;
}

/**
 * Esta é a sua função de query, isolada.
 * Ela não é uma classe, não é injetável.
 * Ela recebe as dependências (db, filtros) como argumentos.
 */
export async function findAllTransportesQuery(
  db: DrizzleClient, // 2. Recebe o cliente Drizzle
  query: UpdateTransporteDto, // 3. Recebe os filtros
  centerId: string,
): Promise<ResultTransporteDto[]> {
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (query.cargaParada) {
    conditions.push(eq(transporte.cargaParada, query.cargaParada));
  }

  conditions.push(eq(transporte.centerId, centerId));

  if (query.status) {
    conditions.push(eq(transporte.status, query.status));
  }

  if (query.nomeRota) {
    conditions.push(eq(transporte.nomeRota, query.nomeRota));
  }

  if (query.nomeTransportadora) {
    conditions.push(
      eq(transporte.nomeTransportadora, query.nomeTransportadora),
    );
  }

  if (query.placa) {
    conditions.push(eq(transporte.placa, query.placa));
  }

  if (query.dataExpedicao) {
    const dataObj = new Date(query.dataExpedicao + 'T00:00:00.000Z');

    const inicioDia = new Date(dataObj);
    inicioDia.setUTCHours(0, 0, 0, 0);

    const fimDia = new Date(dataObj);
    fimDia.setUTCHours(23, 59, 59, 999);
    conditions.push(
      and(
        gte(transporte.dataExpedicao, inicioDia.toISOString()),
        lte(transporte.dataExpedicao, fimDia.toISOString()),
      ),
    );
  }

  if (query.prioridade) {
    conditions.push(eq(transporte.prioridade, query.prioridade));
  }

  if (query.conferencia) {
    conditions.push(eq(transporte.conferencia, query.conferencia));
  }

  if (query.carregamento) {
    conditions.push(eq(transporte.carregamento, query.carregamento));
  }

  if (query.separacao) {
    conditions.push(eq(transporte.separacao, query.separacao));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const subquery = db
    .select({
      transporteId: historicoImpressaoMapa.transporteId,
      qtdImpressoes: count(historicoImpressaoMapa.id).as('qtdImpressoes'),
    })
    .from(historicoImpressaoMapa)
    .groupBy(historicoImpressaoMapa.transporteId)
    .as('hist');

  // 4. Toda a lógica da query vive aqui
  const info = await db
    .select({
      numeroTransporte: transporte.numeroTransporte,
      status: transporte.status,
      nomeRota: transporte.nomeRota,
      nomeTransportadora: transporte.nomeTransportadora,
      placa: transporte.placa,
      criadoEm: transporte.criadoEm,
      atualizadoEm: transporte.atualizadoEm,
      cadastradoPorId: transporte.cadastradoPorId,
      dataExpedicao: transporte.dataExpedicao,
      centerId: transporte.centerId,
      obs: transporte.obs || '',
      prioridade: transporte.prioridade,
      cargaParada: transporte.cargaParada,
      conferencia: transporte.conferencia,
      carregamento: transporte.carregamento,
      separacao: transporte.separacao,
      qtdImpressoes: sql<number>`COALESCE(${subquery.qtdImpressoes}, 0)`,
    })
    .from(transporte)
    .leftJoin(subquery, eq(subquery.transporteId, transporte.numeroTransporte))
    .where(whereClause);

  return info as ResultTransporteDto[];
}
