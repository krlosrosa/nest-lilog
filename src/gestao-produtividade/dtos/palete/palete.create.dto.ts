import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { palete } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const createPaleteSchema = createInsertSchema(palete);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PaleteCreateData = z.infer<typeof createPaleteSchema>;

const paleteCreateSchemaWithOutUpdate = createPaleteSchema.omit({
  atualizadoEm: true,
  criadoPorId: true,
});

export class PaleteCreateDataDto extends createZodDto(
  paleteCreateSchemaWithOutUpdate,
) {}
