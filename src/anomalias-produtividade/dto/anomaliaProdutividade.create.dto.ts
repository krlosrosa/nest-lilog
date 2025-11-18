import { createInsertSchema } from 'drizzle-zod';
import { anomaliaProdutividade } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createAnomaliaProdutividadeSchema = createInsertSchema(
  anomaliaProdutividade,
);

export type AnomaliaProdutividadeCreateData = z.infer<
  typeof createAnomaliaProdutividadeSchema
>;
