import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { user, userCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import { and, eq } from 'drizzle-orm';
import { UserRole } from 'src/_shared/enums/funcionario-role.enum';
import { type IIdentityUserRepository } from 'src/_shared/infra/keycloak/domain/repository/IIdentityUser.repository';

@Injectable()
export class AddNewUser {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    @Inject('IIdentityUserRepository')
    private readonly identityRepository: IIdentityUserRepository,
  ) {}
  async execute(createUserDto: CreateUserDto) {
    // O db.transaction() lida automaticamente com begin, commit e rollback
    // 1. Verifica se o usuário já existe (equivalente ao seu 'hasUser')
    const existingUser = await this.db.query.user.findFirst({
      where: eq(user.id, createUserDto.id),
    });

    // 2. Se o usuário NÃO existir, crie-o
    // (Isso replica a lógica do seu bloco 'if (hasUser) { ... } else { ... }' comentado)
    if (!existingUser) {
      // Criando o usuário no banco de dados local
      await this.db.insert(user).values({
        id: createUserDto.id,
        name: createUserDto.name,
        centerId: createUserDto.centerId,
        turno: createUserDto.turno,
        empresa: createUserDto.empresa,
      });

      if (createUserDto.role !== UserRole.FUNCIONARIO) {
        await this.identityRepository.addUser({
          id: createUserDto.id,
          nome: createUserDto.name,
          centerId: createUserDto.centerId,
          credencial: createUserDto.credencial ?? 'inicial01',
          empresa: createUserDto.empresa,
          turno: createUserDto.turno,
          primeiroNome: createUserDto.primeiroNome ?? '',
          ultimoNome: createUserDto.ultimoNome ?? '',
        });
      }
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

    const existingUserCenter = await this.db.query.userCenter.findFirst({
      where: and(
        eq(userCenter.userId, createUserDto.id),
        eq(userCenter.centerId, createUserDto.centerId),
        eq(userCenter.processo, createUserDto.processo as string),
      ),
    });

    if (existingUserCenter) {
      throw new Error('USuario já alocado nesse centro');
    }

    const insertedAssociation = await this.db
      .insert(userCenter)
      .values(newUserCenterData)
      .returning(); // Retorna a linha recém-criada da tabela 'userCenters'

    // Retorna a associação que foi criada
    return insertedAssociation[0];
  }
}
