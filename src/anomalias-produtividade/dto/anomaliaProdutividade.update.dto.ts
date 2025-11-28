import { createUpdateSchema } from 'drizzle-zod';
import { produtividadeAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateAnomaliaProdutividadeSchema = createUpdateSchema(
  produtividadeAnomalia,
);

export const updateWithDateStartAndEndSchema =
  updateAnomaliaProdutividadeSchema.extend({
    inicio: z.string().optional(),
    fim: z.string().optional(),
  });

export type AnomaliaProdutividadeUpdateDataWithDateStartAndEnd = z.infer<
  typeof updateWithDateStartAndEndSchema
>;

export type AnomaliaProdutividadeUpdateData = z.infer<
  typeof updateAnomaliaProdutividadeSchema
>;
