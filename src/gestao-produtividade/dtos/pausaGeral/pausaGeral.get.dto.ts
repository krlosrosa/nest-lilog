import { createSelectSchema } from 'drizzle-zod';
import { pausaGeral } from 'src/_shared/infra/drizzle/migrations/schema';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getPausaGeralSchema = createSelectSchema(pausaGeral);
// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PausaGeralGetData = z.infer<typeof getPausaGeralSchema>;

export class PausaGeralGetDataDto extends createZodDto(getPausaGeralSchema) {}
