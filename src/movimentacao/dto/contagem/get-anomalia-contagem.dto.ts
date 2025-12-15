import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { liteAnomalia } from 'src/_shared/infra/drizzle/migrations/schema';

export const getAnomaliaContagemSchema = createSelectSchema(liteAnomalia);

export class GetAnomaliaContagemDto extends createZodDto(
  getAnomaliaContagemSchema,
) {}
