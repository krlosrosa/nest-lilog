import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { pausaGeral } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const createPausaGeralSchema = createInsertSchema(pausaGeral);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PausaGeralCreateData = z.infer<typeof createPausaGeralSchema>;

export class PausaGeralCreateDataDto extends createZodDto(
  createPausaGeralSchema.omit({
    id: true,
    atualizadoEm: true,
    registradoPorId: true,
  }),
) {}

export class FindPausaGeral extends createZodDto(
  createPausaGeralSchema.omit({
    id: true,
    atualizadoEm: true,
    registradoPorId: true,
    criadoEm: true,
    motivo: true,
    inicio: true,
    fim: true,
  }),
) {}
