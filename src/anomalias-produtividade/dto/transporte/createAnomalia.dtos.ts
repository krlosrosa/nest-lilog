import { createInsertSchema } from 'drizzle-zod';
import { transporteAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const createTransporteAnomaliaSchema =
  createInsertSchema(transporteAnomalia);

export type TransporteAnomaliaCreateData = z.infer<
  typeof createTransporteAnomaliaSchema
>;
