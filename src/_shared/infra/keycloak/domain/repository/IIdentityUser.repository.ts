import { CriarFuncionarioKeyCloak } from 'src/_shared/infra/keycloak/dto/criarFuncionarioKeCloak.dto';
import { RoleDto } from 'src/user/dto/role.dto';

export interface IIdentityUserRepository {
  addUser(command: CriarFuncionarioKeyCloak): Promise<string | null>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  logout(id: string): Promise<void>;
  getAllRoles(): Promise<RoleDto[]>;
  criarRole(id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
  isServiceHealthy(): Promise<boolean>;
}
