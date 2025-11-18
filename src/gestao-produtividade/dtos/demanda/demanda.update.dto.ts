import { createUpdateSchema } from 'drizzle-zod';
import { demanda } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateDemandaSchema = createUpdateSchema(demanda);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type DemandaUpdateData = z.infer<typeof updateDemandaSchema>;
