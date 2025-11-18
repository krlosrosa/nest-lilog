import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { center } from 'src/_shared/infra/drizzle/migrations/schema';
import { eq } from 'drizzle-orm';
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
export async function findOneCenterQuery(
  db: DrizzleClient, // 2. Recebe o cliente Drizzle
  id: string, // 3. Recebe os filtros
): Promise<CenterDto | undefined> {
  // 4. Toda a lógica da query vive aqui
  const info = await db.query.center.findFirst({
    where: eq(center.centerId, id),
    columns: {
      centerId: true,
      description: true,
      cluster: true,
      state: true,
    },
  });

  return info;
}
