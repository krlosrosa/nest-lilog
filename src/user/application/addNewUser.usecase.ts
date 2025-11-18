import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { user, userCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import { and, eq } from 'drizzle-orm';
import { UserRole } from 'src/_shared/enums/funcionario-role.enum';

@Injectable()
export class AddNewUser {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}
  async execute(createUserDto: CreateUserDto) {
    // O db.transaction() lida automaticamente com begin, commit e rollback
    return await this.db.transaction(async (tx) => {
      // 1. Verifica se o usuário já existe (equivalente ao seu 'hasUser')
      const existingUser = await tx.query.user.findFirst({
        where: eq(user.id, createUserDto.id),
      });

      // 2. Se o usuário NÃO existir, crie-o
      // (Isso replica a lógica do seu bloco 'if (hasUser) { ... } else { ... }' comentado)
      if (!existingUser) {
        /*
         * NOTA SOBRE IDENTITYUSER:
         * A lógica 'this.identityUserRepository.addUser' é uma chamada de serviço externa.
         * Idealmente, ela deve ser chamada ANTES desta função de comando.
         * Se falhar, você nem deveria tentar a transação no DB.
         * Ex:
         * if (createUserDto.role !== UserCenterRole.FUNCIONARIO) {
         * await this.identityUserRepository.addUser(...);
         * }
         * // Só então chame o comando:
         * await createAndAssociateUserCommand(this.db, createUserDto, processo);
         */

        // Criando o usuário no banco de dados local
        await tx.insert(user).values({
          id: createUserDto.id,
          name: createUserDto.name,
          centerId: createUserDto.centerId,
          turno: createUserDto.turno,
          empresa: createUserDto.empresa,
        });
      }

      // 3. Crie a associação 'UserCenter'
      // (Isso substitui o 'userCenterRepository.create' e o 'persistAndFlush')

      // NOTA: Seu código original usava dados 'mockados' ('pavuna', 'carlos').
      // Estamos assumindo que a intenção era usar os dados do DTO.
      const newUserCenterData = {
        userId: createUserDto.id,
        centerId: createUserDto.centerId,
        processo: createUserDto.processo,
        role: createUserDto.role ?? UserRole.FUNCIONARIO,
      };

      const existingUserCenter = await tx.query.userCenter.findFirst({
        where: and(
          eq(userCenter.userId, createUserDto.id),
          eq(userCenter.centerId, createUserDto.centerId),
          eq(userCenter.processo, createUserDto.processo as string),
        ),
      });

      if (existingUserCenter) {
        throw new Error('USuario já alocado nesse centro');
      }

      const insertedAssociation = await tx
        .insert(userCenter)
        .values(newUserCenterData)
        .returning(); // Retorna a linha recém-criada da tabela 'userCenters'

      // Retorna a associação que foi criada
      return insertedAssociation[0];
    });
  }
}
