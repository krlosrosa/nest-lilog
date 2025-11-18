import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { DrizzleHealthIndicator } from './drizzle.health';
import { KeycloakService } from 'src/_shared/infra/keycloak/keycloak.service';
import { KeycloakHealthIndicator } from './keycloak.health';

@Module({
  imports: [
    TerminusModule,
    HttpModule, // Necessário para o HttpHealthIndicator    ,
  ],
  providers: [
    DrizzleHealthIndicator,
    KeycloakHealthIndicator,
    {
      provide: 'IIdentityUserRepository', // O provedor de identidade
      useClass: KeycloakService,
    },
  ],
  controllers: [HealthController],
})
export class HealthModule {}
