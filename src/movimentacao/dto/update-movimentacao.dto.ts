import { createUpdateSchema } from 'drizzle-zod';
import { movimentacao } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateMovimentacaoSchema = createUpdateSchema(movimentacao);

export type UpdateMovimentacao = z.infer<typeof updateMovimentacaoSchema>;

export class UpdateMovimentacaoDto extends createZodDto(
  updateMovimentacaoSchema,
) {}
