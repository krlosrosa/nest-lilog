import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { center } from 'src/_shared/infra/drizzle/migrations/schema';
import { eq } from 'drizzle-orm';
import { CenterDto } from 'src/center/dto/center/create-center.dto';
import { UpdateCenterDto } from 'src/center/dto/center/update-center.dto';

/**
 * Esta função de comando atualiza um Centro pelo seu ID.
 */
export async function updateCenterCommand(
  db: DrizzleClient,
  id: string,
  data: UpdateCenterDto, // Os dados para atualizar
): Promise<CenterDto | undefined> {
  // Retorna o DTO atualizado ou undefined se não achar

  // 1. Use 'db.update()' para criar o comando
  const updatedCenters = await db
    .update(center)
    .set(data) // 2. 'set()' define os campos a serem atualizados
    .where(eq(center.centerId, id)) // 3. 'where()' encontra o registro
    .returning({
      // 4. 'returning()' retorna o registro modificado
      centerId: center.centerId,
      description: center.description,
      cluster: center.cluster,
      state: center.state,
    });

  // 5. 'returning()' sempre retorna um array.
  // Se o ID não foi encontrado, o array estará vazio.
  // Se foi encontrado, pegamos o primeiro (e único) item.
  return updatedCenters[0];
}
