import { createUpdateSchema } from 'drizzle-zod';
import { user } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateUserSchema = createUpdateSchema(user);

export type UserUpdateData = z.infer<typeof updateUserSchema>;
