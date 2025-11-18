import { createSelectSchema } from 'drizzle-zod';
import { historicoStatusTransporte } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getHistoricoTransporteSchema = createSelectSchema(
  historicoStatusTransporte,
);

export type HistoricoStatusTransporteGetData = z.infer<
  typeof getHistoricoTransporteSchema
>;
