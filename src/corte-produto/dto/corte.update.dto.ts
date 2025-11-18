import { createUpdateSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { corteMercadoria } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateCorteMercadoriaSchema = createUpdateSchema(corteMercadoria);

export type CorteMercadoriaUpdateData = z.infer<
  typeof updateCorteMercadoriaSchema
>;

export class FindAllMercadoriaUpdateDto extends createZodDto(
  updateCorteMercadoriaSchema
    .extend({
      inicio: z.string().optional(),
      fim: z.string().optional(),
    })
    .omit({
      id: true,
      criadoEm: true,
      atualizadoEm: true,
      caixas: true,
      unidades: true,
    }),
) {}
