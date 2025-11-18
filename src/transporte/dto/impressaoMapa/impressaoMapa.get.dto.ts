import { createSelectSchema } from 'drizzle-zod';
import { historicoImpressaoMapa } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getImpressaoMapaSchema = createSelectSchema(
  historicoImpressaoMapa,
);

export type ImpressaoMapaGetData = z.infer<typeof getImpressaoMapaSchema>;
