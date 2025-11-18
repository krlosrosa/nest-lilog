import { createSelectSchema } from 'drizzle-zod';
import { user } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getUserSchema = createSelectSchema(user);
export const getUserSchemaOmitPassword = getUserSchema.omit({
  password: true,
  token: true,
  resetSenha: true,
});

export type UserGetData = z.infer<typeof getUserSchemaOmitPassword>;
