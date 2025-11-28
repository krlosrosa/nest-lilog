import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { viewTransporteStatus } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getTransporteSchema = createSelectSchema(viewTransporteStatus);

export type TransporteGetData = z.infer<typeof getTransporteSchema>;

export class TransporteGetDataForAnomaliaDto extends createZodDto(
  getTransporteSchema,
) {}
