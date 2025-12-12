import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { liteValidacao } from 'src/_shared/infra/drizzle/migrations/schema';

export const getContagemSchema = createSelectSchema(liteValidacao);

export class GetContagemDto extends createZodDto(getContagemSchema) {}
