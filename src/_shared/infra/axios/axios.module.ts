// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Global() // <- Torna o módulo global
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      baseURL: process.env.RAVEX_URL || 'https://api.rest.app.ravex.com.br',
    }),
  ],
  exports: [HttpModule], // <- Exporta para que outros módulos possam usar
})
export class AxiosModule {}
