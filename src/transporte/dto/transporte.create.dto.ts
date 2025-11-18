import { createInsertSchema } from 'drizzle-zod';
import { transporte } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod'; // 1. Importe a função

// --- 1. Para LER do banco (EXISTENTE) ---
export const createTransporteSchema = createInsertSchema(transporte);

export type TransporteCreateData = z.infer<typeof createTransporteSchema>;

export class TransporteCreateDto extends createZodDto(createTransporteSchema) {}
