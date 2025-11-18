import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { KeycloakService } from 'src/_shared/infra/keycloak/keycloak.service';
import { AddNewUser } from './application/addNewUser.usecase';
import { AddUserBatch } from './application/addUserBatch.usecase';

@Module({
  controllers: [UserController],
  providers: [
    UserService, // O serviço local
    AddNewUser,
    AddUserBatch,
    {
      provide: 'IIdentityUserRepository', // O provedor de identidade
      useClass: KeycloakService,
    },
  ],
})
export class UserModule {}
