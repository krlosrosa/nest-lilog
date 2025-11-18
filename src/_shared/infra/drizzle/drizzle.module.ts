import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importante!
import { drizzleProvider } from './drizzle.provider';

@Global() // 2. Adicione este decorator
@Module({
  imports: [
    ConfigModule.forRoot(), // Garante que o ConfigService esteja disponível
  ],
  providers: [drizzleProvider],
  exports: [drizzleProvider], // Exporte o provider para outros módulos usarem
})
export class DrizzleModule {}
