import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const addConferenciaCegaSchema = z.object({
  descricao: z.string(),
  sku: z.string(),
  quantidadeCaixas: z.number().default(0),
  quantidadeUnidades: z.number().default(0),
  lote: z.string(),
});

export class AddConferenciaCegaDto extends createZodDto(
  addConferenciaCegaSchema,
) {}
