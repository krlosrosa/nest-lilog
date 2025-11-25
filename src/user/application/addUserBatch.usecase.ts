import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { CreateUserDto } from '../dto/create-user.dto';
import { user, userCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import { and, eq, inArray, or } from 'drizzle-orm';
import { type IIdentityUserRepository } from 'src/_shared/infra/keycloak/domain/repository/IIdentityUser.repository';
import { UserRole } from 'src/_shared/enums/funcionario-role.enum';

@Injectable()
export class AddUserBatch {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    @Inject('IIdentityUserRepository')
    private readonly identityRepository: IIdentityUserRepository,
  ) {}

  async execute(createUserDtos: CreateUserDto[]): Promise<void> {
    if (!createUserDtos || createUserDtos.length === 0) {
      return;
    }

    // --- 1. Identificar usuários novos (antes da transação) ---
    const allUserIds = createUserDtos.map((dto) => dto.id);
    const existingUsers = await this.db.query.user.findMany({
      where: inArray(user.id, allUserIds),
    });
    const existingUserIds = new Set(existingUsers.map((u) => u.id));

    // Filtra DTOs de usuários que realmente são novos
    const newUsersToCreateDtos = createUserDtos
      .filter((dto) => !existingUserIds.has(dto.id))
      .filter(
        (dto, index, self) => self.findIndex((d) => d.id === dto.id) === index,
      );

    // --- 2. Pré-vôo: Criar usuários no Keycloak (Ação Externa) ---

    // Filtra apenas os que precisam de criação externa (não-funcionários)
    const usersToCreateInKeycloak = newUsersToCreateDtos.filter(
      (dto) => dto.role !== UserRole.FUNCIONARIO,
    );

    if (usersToCreateInKeycloak.length > 0) {
      try {
        // Tenta criar TODOS em paralelo
        await Promise.all(
          usersToCreateInKeycloak.map((dto) => {
            if (!dto.credencial || !dto.primeiroNome || !dto.ultimoNome) {
              throw new Error('Campos são obrigatorios');
            }
            return this.identityRepository.addUser({
              id: dto.id,
              nome: dto.name,
              centerId: dto.centerId,
              credencial: dto.credencial,
              empresa: dto.empresa,
              turno: dto.turno,
              primeiroNome: dto.primeiroNome,
              ultimoNome: dto.ultimoNome,
              // ... outros campos que o Keycloak precisar
            });
          }),
        );
      } catch (keycloakError) {
        // Se QUALQUER um falhar ao criar no Keycloak,
        // aborte a operação inteira.
        console.error('Falha ao criar usuários no Keycloak', keycloakError);
        throw new Error(
          'Falha na criação de usuários no Identity Service. Operação abortada.',
        );
      }
    }

    // --- 3. Ação Local (Transação de Banco de Dados) ---
    // Se chegamos aqui, o Keycloak funcionou (ou não era necessário).
    // Agora tentamos o banco de dados.

    try {
      // --- 3a. Inserir Usuários no DB ---
      if (newUsersToCreateDtos.length > 0) {
        await this.db.insert(user).values(
          newUsersToCreateDtos.map((dto) => ({
            id: dto.id,
            name: dto.name,
            centerId: dto.centerId,
          })),
        );
      }

      // --- 3b. Inserir Associações no DB ---
      // (Lógica de verificação de associações existentes)
      const conditions = createUserDtos.map((dto) =>
        and(
          eq(userCenter.userId, dto.id),
          eq(userCenter.centerId, dto.centerId),
          eq(userCenter.processo, dto.processo as string),
        ),
      );
      const existingAssociations = await this.db.query.userCenter.findMany({
        where: or(...conditions),
      });
      const existingAssocSet = new Set(
        existingAssociations.map(
          (a) => `${a.userId}-${a.centerId}-${a.processo}`,
        ),
      );

      const newAssociationsToInsert: (typeof userCenter.$inferInsert)[] = [];
      for (const dto of createUserDtos) {
        const key = `${dto.id}-${dto.centerId}-${dto.processo}`;
        if (existingAssocSet.has(key)) {
          continue;
        }
        newAssociationsToInsert.push({
          userId: dto.id,
          centerId: dto.centerId,
          processo: dto.processo,
          role: dto.role ?? UserRole.FUNCIONARIO,
          roles: dto.roles,
        });
        existingAssocSet.add(key);
      }

      if (newAssociationsToInsert.length === 0) {
        return;
      }

      await this.db
        .insert(userCenter)
        .values(newAssociationsToInsert)
        .returning();
    } catch (dbError) {
      // --- 4. Compensação (Rollback da Ação Externa) ---
      // O banco de dados falhou! Precisamos deletar os usuários do Keycloak.
      console.error(
        'Falha na transação do banco de dados. Iniciando compensação...',
        dbError,
      );

      if (usersToCreateInKeycloak.length > 0) {
        console.warn(
          `DELETANDO ${usersToCreateInKeycloak.length} usuários do Keycloak...`,
        );
        try {
          await Promise.all(
            usersToCreateInKeycloak.map((dto) =>
              this.identityRepository.deleteUser(dto.id),
            ),
          );
          console.warn('Compensação do Keycloak concluída.');
        } catch (compensationError) {
          // FALHA CRÍTICA
          console.error(
            'FALHA CRÍTICA NA COMPENSAÇÃO! Usuários órfãos no Keycloak:',
            usersToCreateInKeycloak.map((u) => u.id),
            compensationError,
          );
          // Aqui você deve logar em um sistema de alerta (Sentry, Datadog)
          // para correção manual.
        }
      }

      // Re-lança o erro original do banco de dados
      throw dbError;
    }
  }
}
