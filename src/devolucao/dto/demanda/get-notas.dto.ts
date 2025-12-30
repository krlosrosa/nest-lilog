import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { devolucaoNotas } from 'src/_shared/infra/drizzle';

export const getNotasSchema = createSelectSchema(devolucaoNotas);

export class GetNotasDto extends createZodDto(getNotasSchema) {}
