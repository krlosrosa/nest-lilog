import { createInsertSchema } from 'drizzle-zod';
import { historicoStatusTransporte } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod'; // 1. Importe a função

// --- 1. Para LER do banco (EXISTENTE) ---
export const createHistoricoTransporteSchema = createInsertSchema(
  historicoStatusTransporte,
);

export type HistoricoTransporteCreateData = z.infer<
  typeof createHistoricoTransporteSchema
>;

export class HistoricoStatusTransporteCreateData extends createZodDto(
  createHistoricoTransporteSchema,
) {}
