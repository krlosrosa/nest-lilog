import { and, eq, gte, lte, SQL, isNull, isNotNull } from 'drizzle-orm';
import { DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { pausaGeral } from 'src/_shared/infra/drizzle/migrations/schema';
import { PausaGeralSearchParamsDto } from 'src/gestao-produtividade/dtos/pausaGeral/pausaGeral.update.dto';

export async function buscarPausasGeraisQuery(
  db: DrizzleClient,
  centerId: string,
  params?: PausaGeralSearchParamsDto,
) {
  const conditions: SQL[] = [];

  conditions.push(eq(pausaGeral.centerId, centerId));

  if (params?.turno) {
    conditions.push(eq(pausaGeral.turno, params.turno));
  }

  if (params?.processo) {
    conditions.push(eq(pausaGeral.processo, params.processo));
  }

  if (params?.segmento) {
    conditions.push(eq(pausaGeral.segmento, params.segmento));
  }

  if (params?.motivo) {
    conditions.push(eq(pausaGeral.motivo, params.motivo));
  }
  if (params?.id) {
    conditions.push(eq(pausaGeral.id, params.id));
  }

  if (params?.inicio) {
    conditions.push(gte(pausaGeral.inicio, params.inicio));
  }

  if (params?.fim) {
    conditions.push(lte(pausaGeral.fim, params.fim));
  }

  // Correção melhor (considerando o caso 'false')
  if (params?.ativo === 'true') {
    conditions.push(isNull(pausaGeral.fim));
  } else if (params?.ativo === 'false') {
    conditions.push(isNotNull(pausaGeral.fim));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.select().from(pausaGeral).where(whereClause);
}
