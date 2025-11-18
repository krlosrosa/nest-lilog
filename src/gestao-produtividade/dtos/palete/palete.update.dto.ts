import { createUpdateSchema } from 'drizzle-zod';
import { palete } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updatePaleteSchema = createUpdateSchema(palete);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PaleteUpdateData = z.infer<typeof updatePaleteSchema>;
