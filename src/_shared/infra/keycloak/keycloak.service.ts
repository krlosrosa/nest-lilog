import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { IIdentityUserRepository } from './domain/repository/IIdentityUser.repository';
import { CriarFuncionarioKeyCloak } from './dto/criarFuncionarioKeCloak.dto';
import { RoleDto } from 'src/user/dto/role.dto';

@Injectable()
export class KeycloakService implements IIdentityUserRepository {
  private readonly logger = new Logger(KeycloakService.name);
  private kcAdminClient: KeycloakAdminClient;

  // INJEÇÃO DE DEPENDÊNCIA: O cliente Keycloak agora é injetado.
  constructor() {}

  private async getClient(): Promise<any> {
    if (!this.kcAdminClient) {
      const { default: KcAdminClient } = await import(
        '@keycloak/keycloak-admin-client'
      );
      this.kcAdminClient = new KcAdminClient({
        baseUrl: process.env.KEYCLOAK_URL,
        realmName: process.env.REALM_NAME,
      });
    }
    await this.kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: 'backend', // O Client ID que você criou
      clientSecret: process.env.CLIENT_SECRET_KEYCLOAK, // O Client Secret que você copiou
    });
    return this.kcAdminClient;
  }

  async addUser(user: CriarFuncionarioKeyCloak): Promise<string | null> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    this.logger.log(`Tentando criar usuário com username: ${user.id}`);
    try {
      // O username no Keycloak será o 'id' do DTO.
      const userInfo = await this.getUserByUserName(user.id, kcAdminClient);
      if (userInfo) return null;
      const userCreated = await kcAdminClient.users.create({
        username: user.id,
        enabled: true,
        firstName: user.primeiroNome,
        lastName: user.ultimoNome,
        credentials: [
          {
            type: 'password',
            value: user.credencial,
            temporary: true, // Força o usuário a trocar a senha no primeiro login.
          },
        ],
      });
      this.logger.log(`Usuário ${userCreated.id} criado com sucesso.`);
      return userCreated.id;
    } catch (error) {
      this.logger.error('Falha ao criar usuário no Keycloak', error.stack);
      // VALIDAÇÃO: Verifica se o erro é de conflito (usuário já existe).
      if (error.response?.status === 409) {
        return null;
      }
      throw new InternalServerErrorException(
        'Erro ao se comunicar com o serviço de identidade.',
      );
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    this.logger.log(`Tentando deletar usuário com ID: ${userId}`);
    try {
      const user = await this.getUserByUserName(userId, kcAdminClient);
      if (!user) return;
      await kcAdminClient.users.del({ id: user });
      this.logger.log(`Usuário ${userId} deletado com sucesso.`);
    } catch (error) {
      this.logger.error(`Falha ao deletar usuário ${userId}`, error.stack);
      // VALIDAÇÃO: Verifica se o usuário não foi encontrado.
      if (error.response?.status === 404) {
        throw new NotFoundException(
          `Usuário com ID '${userId}' não encontrado.`,
        );
      }
      throw new InternalServerErrorException(
        'Erro ao deletar usuário no serviço de identidade.',
      );
    }
  }

  async resetPassword(username: string, newPassword: string): Promise<void> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    this.logger.log(`Tentando resetar a senha do usuário: ${username}`);
    try {
      // VALIDAÇÃO: Busca o usuário pelo username para obter o ID interno.
      const user = await this.getUserByUserName(username, kcAdminClient);
      if (!user) return;
      await kcAdminClient.users.resetPassword({
        id: user,
        credential: {
          type: 'password',
          value: newPassword,
          temporary: true,
        },
      });
      this.logger.log(`Senha do usuário ${user} resetada com sucesso.`);
    } catch (error) {
      // Se o erro já for um NotFoundException, apenas o relance.
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(
        `Falha ao resetar a senha do usuário ${username}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Erro ao resetar a senha no serviço de identidade.',
      );
    }
  }

  async logout(userId: string): Promise<void> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    this.logger.log(`Tentando fazer logout do usuário: ${userId}`);
    try {
      if (!userId) return;
      await kcAdminClient.users.logout({ id: userId });
      this.logger.log(`Sessões do usuário ${userId} encerradas com sucesso.`);
    } catch (error) {
      this.logger.error(
        `Falha ao fazer logout do usuário ${userId}`,
        error.stack,
      );
      // A API de logout pode não retornar 404 se o usuário não existir.
      // Tratar como um erro genérico, a menos que a API do Keycloak garanta um código específico.
      throw new InternalServerErrorException(
        'Erro ao encerrar sessão do usuário.',
      );
    }
  }

  async getAllRoles(): Promise<RoleDto[]> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    const roles = await kcAdminClient.clients.listRoles({
      id: process.env.KEYCLOAK_ID_CLIENT as string,
      realm: 'lilo',
    });
    return roles as RoleDto[];
  }

  async criarRole(id: string): Promise<void> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    await kcAdminClient.clients.createRole({
      name: id,
      id: process.env.KEYCLOAK_ID_CLIENT,
    });
  }

  private async getUserByUserName(
    userName: string,
    kcAdminClient: KeycloakAdminClient,
  ): Promise<string | null> {
    const users = await kcAdminClient.users.find({ userName });
    if (!users || users.length === 0) {
      return null;
    }
    if (users.length > 1) {
      this.logger.warn(
        `Múltiplos usuários encontrados para o userName: ${userName}`,
      );
      throw new ConflictException(
        'Múltiplos usuários encontrados com o mesmo userName.',
      );
    }

    const user = users[0];
    return user.id as string;
  }

  /**
   * Verifica a saúde da *conexão autenticada* com o Keycloak.
   * Tenta executar um comando leve (serverInfo) para validar
   * se a rede, a URL e o token de acesso estão todos funcionando.
   */
  public async isServiceHealthy(): Promise<boolean> {
    const kcAdminClient: KeycloakAdminClient = await this.getClient();
    if (!kcAdminClient) {
      this.logger.warn('[HealthCheck] Falhou: Cliente não inicializado.');
      return false;
    }
    try {
      await kcAdminClient.serverInfo.find();
      return true;
    } catch (error) {
      this.logger.error(
        '[HealthCheck] Falhou: Não foi possível se comunicar com a admin API.',
        error.message,
      );
      return false;
    }
  }
}
