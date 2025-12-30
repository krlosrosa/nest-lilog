import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { devolucaoItens } from 'src/_shared/infra/drizzle';

export const getItensSchema = createSelectSchema(devolucaoItens);

export class GetItensDto extends createZodDto(getItensSchema) {}
