import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { type IIdentityUserRepository } from 'src/_shared/infra/keycloak/domain/repository/IIdentityUser.repository';
import { QueriesDtoUserCenter } from './dto/queries.dto';
import { InfoMeDto } from './dto/infoMe.dto';
import { RoleDto } from './dto/role.dto';
import { AddNewUser } from './application/addNewUser.usecase';
import { UserDto } from './dto/listUser.dto';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { user, userCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import { and, eq, ilike, or, SQL } from 'drizzle-orm';
import { RedisService } from 'src/_shared/infra/redis/redis.service';
import { AddUserBatch } from './application/addUserBatch.usecase';
import { EditUserDto } from './dto/updateUser.dto';
import { DemandaTurno } from 'src/_shared/enums';

@Injectable()
export class UserService {
  constructor(
    @Inject('IIdentityUserRepository')
    private readonly identityUserRepository: IIdentityUserRepository,
    @Inject(AddNewUser)
    private readonly addNewUser: AddNewUser,
    @Inject(AddUserBatch)
    private readonly addNewUserBatch: AddUserBatch,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    private readonly redis: RedisService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return this.addNewUser.execute(createUserDto);
  }
  async createbath(createUserDto: CreateUserDto[]) {
    return this.addNewUserBatch.execute(createUserDto);
  }

  async findAll(
    centerId: string,
    query?: QueriesDtoUserCenter,
  ): Promise<UserDto[]> {
    // Monta as condições dinamicamente
    const conditions = [eq(userCenter.centerId, centerId)];
    const conditionsOr: (SQL<unknown> | undefined)[] = [];

    if (query?.processo) {
      conditions.push(eq(userCenter.processo, query.processo));
    }

    if (query?.role) {
      conditions.push(eq(userCenter.role, query.role));
    }

    if (query?.search) {
      const searchPattern = `%${query.search.trim()}%`;
      conditionsOr.push(
        or(ilike(user.id, searchPattern), ilike(user.name, searchPattern)),
      );
    }

    // Query com join explícito
    const results = await this.db
      .select({
        centerId: userCenter.centerId,
        processo: userCenter.processo,
        role: userCenter.role,
        userId: user.id,
        name: user.name,
        empresa: user.empresa,
        turno: user.turno,
      })
      .from(userCenter)
      .innerJoin(user, eq(user.id, userCenter.userId))
      .where(and(...conditions, ...conditionsOr));

    // Mapeia para o formato esperado
    return results.map((row) => ({
      centerId: row.centerId,
      empresa: row.empresa,
      id: row.userId,
      name: row.name,
      roles: [], // se precisar buscar de outra tabela depois
      turno: row.turno as DemandaTurno,
    }));
  }

  async infoMe(accountId: string): Promise<InfoMeDto> {
    const userCenters = await this.db
      .select({
        userId: userCenter.userId,
        roles: userCenter.roles,
        name: user.name,
        centerId: userCenter.centerId,
        empresa: user.empresa,
      })
      .from(userCenter)
      .leftJoin(user, eq(user.id, userCenter.userId))
      .where(eq(userCenter.userId, accountId));

    if (!userCenters.length) {
      throw new Error('Usuário não encontrado');
    }

    // 2️⃣ Pega o id e name do primeiro registro
    const { userId, name, empresa } = userCenters[0];

    // 3️⃣ Achata todos os arrays de roles e remove duplicatas
    const rolesWithCenter = userCenters.flatMap((uc) =>
      (uc.roles ?? []).map((role) => `${role}:${uc.centerId}`),
    );
    const uniqueRoles = [...new Set(rolesWithCenter.filter(Boolean))];

    // 4️⃣ Retorna no formato do DTO
    const dataResult = {
      id: userId,
      name: name as string,
      roles: uniqueRoles,
      empresa: empresa as 'LDB' | 'ITB' | 'DPA',
    };
    await this.redis.set(accountId, JSON.stringify(dataResult), 3600);
    return dataResult;
  }

  async buscarRoles(): Promise<RoleDto[]> {
    return this.identityUserRepository.getAllRoles();
  }

  async criarRoles(id: string) {
    await this.identityUserRepository.criarRole(id);
  }

  async remove(id: string, centerId: string): Promise<void> {
    await this.db
      .delete(userCenter)
      .where(and(eq(userCenter.userId, id), eq(userCenter.centerId, centerId)));
  }

  async update(id: string, data: EditUserDto): Promise<void> {
    await this.db
      .update(user)
      .set({
        name: data.name,
        turno: data.turno,
      })
      .where(eq(user.id, id));
  }

  async resetSenha(id: string, password: string): Promise<void> {
    await this.identityUserRepository.resetPassword(id, password);
  }

  async logout(id: string): Promise<void> {
    await this.identityUserRepository.logout(id);
  }

  async updatePermissions(
    id: string,
    centerId: string,
    permissions: string[],
  ): Promise<void> {
    await this.db
      .update(userCenter)
      .set({
        roles: permissions,
      })
      .where(and(eq(userCenter.userId, id), eq(userCenter.centerId, centerId)));
  }

  async getAllPermissionsByCenter(
    userId: string,
    centerId: string,
  ): Promise<string[]> {
    const permissions = await this.db
      .select({
        roles: userCenter.roles,
      })
      .from(userCenter)
      .where(
        and(eq(userCenter.userId, userId), eq(userCenter.centerId, centerId)),
      );
    return [
      ...new Set(permissions.flatMap((permission) => permission.roles ?? [])),
    ];
  }
}
