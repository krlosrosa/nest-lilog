import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { movimentacao } from 'src/_shared/infra/drizzle/migrations/schema';

export const getMovimentacaoSchema = createSelectSchema(movimentacao);

export class GetMovimentacaoDto extends createZodDto(getMovimentacaoSchema) {}
