import { createUpdateSchema } from 'drizzle-zod';
import { pausaGeral } from 'src/_shared/infra/drizzle/migrations/schema';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updatePausaGeralSchema = createUpdateSchema(pausaGeral).extend({
  ativo: z.enum(['true', 'false']).optional(),
});

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PausaGeralUpdateData = z.infer<typeof updatePausaGeralSchema>;

export class PausaGeralSearchParamsDto extends createZodDto(
  updatePausaGeralSchema.omit({ centerId: true }),
) {}
