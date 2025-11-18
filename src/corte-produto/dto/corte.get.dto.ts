import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { corteMercadoria } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getCorteMercadoriaSchema = createSelectSchema(corteMercadoria);

export type CorteMercadoriaGetData = z.infer<typeof getCorteMercadoriaSchema>;

export class CorteMercadoriaGetDto extends createZodDto(
  getCorteMercadoriaSchema,
) {}
