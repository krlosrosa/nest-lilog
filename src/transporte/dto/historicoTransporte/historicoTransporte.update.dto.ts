import { createUpdateSchema } from 'drizzle-zod';
import { historicoStatusTransporte } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateHistoricoTransporteSchema = createUpdateSchema(
  historicoStatusTransporte,
);

export type HistoricoTransporteUpdateData = z.infer<
  typeof updateHistoricoTransporteSchema
>;
