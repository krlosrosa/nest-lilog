import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { viewDemandaProdutividade } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getDemandaSchema = createSelectSchema(viewDemandaProdutividade);

export type DemandaGetData = z.infer<typeof getDemandaSchema>;

export class DemandaGetDataForAnomaliaDto extends createZodDto(
  getDemandaSchema,
) {}
