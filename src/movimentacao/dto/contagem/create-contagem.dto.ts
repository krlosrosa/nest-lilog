import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { liteValidacao } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createContagemSchema = createInsertSchema(liteValidacao);

export type CreateContagem = z.infer<typeof createContagemSchema>;

export class CreateContagemDto extends createZodDto(createContagemSchema) {}
