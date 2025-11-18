import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { transporte } from 'src/_shared/infra/drizzle/migrations/schema';

export const createTransporteSchema = createSelectSchema(transporte).omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
  cadastradoPorId: true,
});

export class CreateTransporteItemDto extends createZodDto(
  createTransporteSchema,
) {}

export const createTransporteArraySchema = z
  .array(createTransporteSchema)
  .min(1, 'Array deve conter pelo menos 1 transporte');

export class CreateTransporteDto extends createZodDto(
  createTransporteArraySchema,
) {}
