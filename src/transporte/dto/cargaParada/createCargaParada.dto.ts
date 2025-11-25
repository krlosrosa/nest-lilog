import { createInsertSchema } from 'drizzle-zod';
import { transporteCargaParada } from 'src/_shared/infra/drizzle/migrations/schema';
import { createZodDto } from 'nestjs-zod';

export const createCargaParadaSchema = createInsertSchema(
  transporteCargaParada,
);
export class CreateCargaParadaDto extends createZodDto(
  createCargaParadaSchema,
) {}
