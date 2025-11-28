import {
  and,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  or,
  SQL,
} from 'drizzle-orm';
import { DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  demanda,
  palete,
  pausa,
  transporte,
  user,
} from 'src/_shared/infra/drizzle/migrations/schema';
import { FindAllParams } from 'src/gestao-produtividade/dtos/params.dto';
import { agruparDemandasComRelacionamentos } from 'src/gestao-produtividade/utils/agruparDemandasComRelacionamentos';
//import { DateTime } from 'luxon';

export async function buscarDemandasQuery(
  db: DrizzleClient,
  params?: FindAllParams,
) {
  const conditions: (SQL<unknown> | undefined)[] = [];
  if (params?.demandaIds && params.demandaIds.length > 0) {
    conditions.push(inArray(demanda.id, params.demandaIds));
  }

  if (params?.funcionarioId) {
    conditions.push(eq(demanda.funcionarioId, params.funcionarioId));
  }

  if (params?.centerId) {
    conditions.push(eq(demanda.centerId, params.centerId));
  }

  if (params?.processo) {
    conditions.push(eq(demanda.processo, params.processo));
  }

  if (params?.turno) {
    conditions.push(eq(demanda.turno, params.turno));
  }

  if (params?.status) {
    const statusArray = Array.isArray(params.status)
      ? params.status
      : [params.status];
    conditions.push(inArray(demanda.status, statusArray));
  }

  if (params?.paleteIds && params.paleteIds.length > 0) {
    conditions.push(inArray(palete.id, params.paleteIds));
  }

  if (params?.segmento) {
    conditions.push(eq(palete.segmento, params.segmento));
  }

  if (params?.empresa) {
    conditions.push(eq(palete.empresa, params.empresa));
  }

  if (params?.dataInicio && params?.dataFim) {
    // Converte a data recebida para o início do dia (00:00:00.000)
    const dataInicio = new Date(params.dataInicio);
    dataInicio.setHours(0, 0, 0, 0);
    const dataInicioISO = dataInicio.toISOString();

    // Converte a data recebida para o final do dia (23:59:59.999)
    const dataFim = new Date(params.dataFim);
    dataFim.setHours(23, 59, 59, 999);
    const dataFimISO = dataFim.toISOString();
    conditions.push(
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
              gte(transporte.dataExpedicao, dataInicioISO),
              lte(transporte.dataExpedicao, dataFimISO),
            ),
          ),
      ),
    );
  }

  if (params?.search) {
    const searchConditions: (SQL<unknown> | undefined)[] = [];
    const searchNum = Number(params.search);

    // Busca numérica no ID da demanda
    if (!isNaN(searchNum)) {
      searchConditions.push(eq(demanda.id, searchNum));
    }

    // Busca de texto nos campos de texto
    searchConditions.push(
      ilike(demanda.funcionarioId, `%${params.search}%`),
      ilike(user.name, `%${params.search}%`),
      ilike(palete.id, `%${params.search}%`),
      ilike(palete.transporteId, `%${params.search}%`),
    );

    conditions.push(or(...searchConditions));
  }

  // Filtro por data de expedição do transporte usando EXISTS
  // Filtra pelo dia inteiro (00:00:00 até 23:59:59.999) para garantir todos os registros da data
  // Isso evita multiplicação de linhas quando uma demanda tem múltiplos paletes/transportes
  if (params?.dataRegistro) {
    // Cria a data no formato UTC para evitar problemas de timezone
    //const dataInicioISO = startOfDay(params.dataRegistro).toUTCString();
    // const dataFimISO = endOfDay(params.dataRegistro).toUTCString();

    const inicioDia = new Date(params.dataRegistro);
    inicioDia.setUTCHours(0, 0, 0, 0);

    const fimDia = new Date(params.dataRegistro);
    fimDia.setUTCHours(23, 59, 59, 999);

    conditions.push(
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
  }

  /*if (params?.paleteIds && params.paleteIds.length > 0) {
    conditions.push(
      sql`exists (
        select 1
        from "Palete" p
        where p."demandaId" = demanda."id"
        and p."id" in ${sql.join(params.paleteIds, sql`, `)}
      )`,
    );
  }*/

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const demandas = await db
    .select()
    .from(demanda)
    .where(whereClause)
    .leftJoin(pausa, eq(demanda.id, pausa.demandaId))
    .leftJoin(palete, eq(demanda.id, palete.demandaId))
    .leftJoin(user, eq(demanda.funcionarioId, user.id))
    .leftJoin(transporte, eq(palete.transporteId, transporte.numeroTransporte));

  /* const demandas = await db.query.demanda.findMany({
    where: whereClause,
    with: {
      pausas: true, // E você ainda pode carregar as pausas!
      paletes: true, // E você ainda pode carregar as paletes!
    },
  });*/

  const ajustedDemandas = agruparDemandasComRelacionamentos(demandas);

  return ajustedDemandas;
}
