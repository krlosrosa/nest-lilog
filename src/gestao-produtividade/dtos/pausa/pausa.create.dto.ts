import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { pausa } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const createPausaSchema = createInsertSchema(pausa);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PausaCreateData = z.infer<typeof createPausaSchema>;

export class PausaCreateDataDto extends createZodDto(
  createPausaSchema.omit({ registradoPorId: true, demandaId: true }),
) {}
