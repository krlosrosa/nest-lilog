import { createInsertSchema } from 'drizzle-zod';
import { demanda } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod'; // 1. Importe a função

// --- 1. Para LER do banco (EXISTENTE) ---
export const createDemandaSchema = createInsertSchema(demanda);

export const getDemandaSchemaComPaletesIds = createDemandaSchema.extend({
  paletesIds: z.array(z.string()).optional().default([]), // A relação!
});

export type DemandaCreateData = z.infer<typeof createDemandaSchema>;

export class DemandaCreateDataComPaletesIds extends createZodDto(
  getDemandaSchemaComPaletesIds.omit({ cadastradoPorId: true, inicio: true }),
) {}
