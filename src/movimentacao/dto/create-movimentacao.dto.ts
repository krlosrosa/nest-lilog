import { createInsertSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { movimentacao } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createMovimentacaoSchema = createInsertSchema(movimentacao);

export type CreateMovimentacao = z.infer<typeof createMovimentacaoSchema>;

export class CreateMovimentacaoDto extends createZodDto(
  createMovimentacaoSchema,
) {}
