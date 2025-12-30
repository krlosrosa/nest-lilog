import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { devolucaoDemanda } from 'src/_shared/infra/drizzle';

export const listarDemandasSchema = createSelectSchema(devolucaoDemanda);

export class ListarDemandasDto extends createZodDto(listarDemandasSchema) {}
