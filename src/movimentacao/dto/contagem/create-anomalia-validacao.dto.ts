import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { liteAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createAnomaliaContagemLiteSchema = createInsertSchema(
  liteAnomalia,
).omit({ id: true, endereco: true, centroId: true });

export type CreateAnomaliaContagemLite = z.infer<
  typeof createAnomaliaContagemLiteSchema
>;

export class CreateAnomaliaContagemLiteDto extends createZodDto(
  createAnomaliaContagemLiteSchema,
) {}
