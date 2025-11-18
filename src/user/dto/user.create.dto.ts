import { createInsertSchema } from 'drizzle-zod';
import { user } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod'; // 1. Importe a função

// --- 1. Para LER do banco (EXISTENTE) ---
export const createUserSchema = createInsertSchema(user);

export type UserCreateData = z.infer<typeof createUserSchema>;

export class UserCreateDto extends createZodDto(createUserSchema) {}
