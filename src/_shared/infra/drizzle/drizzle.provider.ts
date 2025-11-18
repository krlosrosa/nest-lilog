// 1. Remova 'FactoryProvider' daqui
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DRIZZLE_PROVIDER } from './drizzle.constants';
import * as schema from './'; // Importe seu schema

// 2. Remova o ': FactoryProvider' daqui
export const drizzleProvider = {
  provide: DRIZZLE_PROVIDER,
  inject: [ConfigService], // Injete o ConfigService
  useFactory: (configService: ConfigService) => {
    // Obtenha a URL do banco de dados do .env
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL não está definida nas variáveis de ambiente',
      );
    }

    const client = postgres(connectionString, {
      max: 900,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Instancie o Drizzle e passe o schema
    return drizzle(client, { schema });
  },
};

// 3. Agora este tipo será inferido CORRETAMENTE
// (Não será mais 'any')
export type DrizzleClient = ReturnType<(typeof drizzleProvider)['useFactory']>;
