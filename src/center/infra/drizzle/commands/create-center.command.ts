import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  center,
  userCenter,
} from 'src/_shared/infra/drizzle/migrations/schema'; // Importe os 2 schemas
import { and, eq } from 'drizzle-orm';
import { CenterDto } from 'src/center/dto/center/create-center.dto';

/**
 * Esta é a sua função de "Comando", isolada.
 * Ela executa uma transação para criar um centro
 * e atualizar/criar o 'userCenter' associado.
 */
export async function createCenterCommand(
  db: DrizzleClient, // 1. Recebe o cliente Drizzle (NÃO o 'tx')
  centerDto: CenterDto,
  userId: string,
): Promise<CenterDto> {
  // 2. Inicie a transação. O Drizzle fornece o 'tx' (transaction client)
  // 3. Assumindo que 'centerDto.centerId' já está definido (ex: UUID ou string)
  // Se 'centerId' for SERIAL, a lógica precisa ser invertida (criar center primeiro)
  const newRole = `manage:all`;

  const existingCenter = await db.query.center.findFirst({
    where: eq(center.centerId, centerDto.centerId),
  });

  if (existingCenter) {
    throw new Error('Centro já existe');
  }

  const [newCenter] = await db.insert(center).values(centerDto).returning();

  // 4. Encontra o UserCenter (usando 'tx', não 'db')
  const existingUserCenter = await db.query.userCenter.findFirst({
    where: and(
      eq(userCenter.userId, userId),
      eq(userCenter.centerId, centerDto.centerId),
    ),
  });

  // 5. Lógica de Atualizar ou Inserir o UserCenter
  if (existingUserCenter) {
    // ✅ Atualiza
    const currentRoles = existingUserCenter.roles || [];

    if (!currentRoles.includes(newRole)) {
      const updatedRoles = [...currentRoles, newRole];

      await db
        .update(userCenter)
        .set({ roles: updatedRoles })
        .where(eq(userCenter.userId, existingUserCenter.userId));
    }
  } else {
    // ✅ Cria
    await db.insert(userCenter).values({
      userId: userId,
      centerId: centerDto.centerId, // Link para o centro
      processo: 'ALL',
      role: 'MASTER', // Assumindo 'UserCenterRole.MASTER'
      roles: [newRole],
    });
  }
  // 6. Insere o novo Centro (usando 'tx')
  // .returning() retorna um array, então pegamos o primeiro item

  // 7. A transação faz o "commit" automático se 'newCenter' for retornado
  return newCenter;
}
