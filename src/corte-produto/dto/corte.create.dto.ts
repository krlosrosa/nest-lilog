import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { corteMercadoria } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
// --- 1. Para LER do banco (EXISTENTE) ---
export const createCorteMercadoriaSchema = createInsertSchema(corteMercadoria);

export type CorteMercadoriaCreateData = z.infer<
  typeof createCorteMercadoriaSchema
>;

export class CorteMercadoriaDto extends createZodDto(
  createCorteMercadoriaSchema.omit({
    id: true,
    criadoEm: true,
    atualizadoEm: true,
    criadoPorId: true,
    centerId: true,
  }),
) {}
