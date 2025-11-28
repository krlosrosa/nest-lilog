import { createInsertSchema } from 'drizzle-zod';
import { produtividadeAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createAnomaliaProdutividadeSchema = createInsertSchema(
  produtividadeAnomalia,
);

export type AnomaliaProdutividadeCreateData = z.infer<
  typeof createAnomaliaProdutividadeSchema
>;
