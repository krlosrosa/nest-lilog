import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { produtividadeAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getAnomaliaProdutividadeSchema = createSelectSchema(
  produtividadeAnomalia,
);

export type AnomaliaProdutividadeGetData = z.infer<
  typeof getAnomaliaProdutividadeSchema
>;

export class AnomaliaProdutividadeGetDataDto extends createZodDto(
  getAnomaliaProdutividadeSchema,
) {}
