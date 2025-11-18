import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/_shared/infra/drizzle/migrations/schema.ts',
  out: './src/_shared/infra/drizzle/migrations',
  dialect: 'postgresql', // 'mysql' ou 'sqlite'
  dbCredentials: {
    // Certifique-se de que estas variáveis de ambiente estão carregadas
    // ao executar o script do drizzle-kit
    url: process.env.DRIZZLE_URL as string,
  },
  verbose: true,
  strict: true,
});
