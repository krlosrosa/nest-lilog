import { createSelectSchema } from 'drizzle-zod';
import { pausa } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getPausaSchema = createSelectSchema(pausa);

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PausaGetData = z.infer<typeof getPausaSchema>;
