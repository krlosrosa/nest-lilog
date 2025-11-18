import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { type IIdentityUserRepository } from 'src/_shared/infra/keycloak/domain/repository/IIdentityUser.repository';

@Injectable()
export class KeycloakHealthIndicator extends HealthIndicator {
  constructor(
    @Inject('IIdentityUserRepository')
    private readonly identityUserRepository: IIdentityUserRepository,
  ) {
    super();
  }

  // ESTE MÉTODO RETORNA O HealthIndicatorResult CORRETO
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.identityUserRepository.isServiceHealthy();

      if (isHealthy) {
        // Retorna o objeto que o Terminus espera
        return this.getStatus(key, true);
      } else {
        return this.getStatus(key, false, {
          message: 'Keycloak admin API check failed',
        });
      }
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    }
  }
}
