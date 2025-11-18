import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { center } from 'src/_shared/infra/drizzle/migrations/schema'; // Usando 'center' (singular) como no seu exemplo
import { eq } from 'drizzle-orm';
import { CenterDto } from 'src/center/dto/center/create-center.dto'; // Para o tipo de retorno

/**
 * Esta função de comando remove um Centro pelo seu ID.
 */
export async function removeCenterCommand(
  db: DrizzleClient,
  id: string,
): Promise<CenterDto | undefined> {
  // Retorna o DTO do centro removido ou undefined se não achar

  // 1. Use 'db.delete()' para criar o comando
  const deletedCenters = await db
    .delete(center)
    .where(eq(center.centerId, id)) // 2. 'where()' encontra o registro para deletar
    .returning({
      // 3. 'returning()' retorna o registro que foi removido
      //    (Especificamos os campos para que o tipo de retorno seja o CenterDto)
      centerId: center.centerId,
      description: center.description,
      cluster: center.cluster,
      state: center.state,
    });

  // 4. 'returning()' sempre retorna um array.
  // Se o ID não foi encontrado, o array estará vazio.
  // Se foi encontrado, pegamos o primeiro (e único) item.
  return deletedCenters[0];
}
