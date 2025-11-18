import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { center } from 'src/_shared/infra/drizzle/migrations/schema';
import { eq, and, SQL } from 'drizzle-orm';
import { CenterDto } from 'src/center/dto/center/create-center.dto';

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
export async function findAllCentersQuery(
  db: DrizzleClient, // 2. Recebe o cliente Drizzle
  query: FindAllCentersQueryDto, // 3. Recebe os filtros
): Promise<CenterDto[]> {
  const conditions: SQL[] = [];
  if (query.centerId) {
    conditions.push(eq(center.centerId, query.centerId));
  }

  if (query.state) {
    conditions.push(eq(center.state, query.state));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 4. Toda a lógica da query vive aqui
  const info = await db
    .select({
      centerId: center.centerId,
      description: center.description,
      cluster: center.cluster,
      state: center.state,
    })
    .from(center)
    .where(whereClause);

  return info;
}
