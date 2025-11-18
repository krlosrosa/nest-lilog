import { createUpdateSchema } from 'drizzle-zod';
import { transporte } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateTransporteSchema = createUpdateSchema(transporte);

export type TransporteUpdateData = z.infer<typeof updateTransporteSchema>;
