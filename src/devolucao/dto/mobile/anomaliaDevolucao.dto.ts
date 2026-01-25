import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const anomaliaDevolucaoDtoSchema = z.object({
  demandaId: z.number(),
  sku: z.string(),
  descricao: z.string(),
  lote: z.string(),
  tipo: z.string(),
  natureza: z.string(),
  causa: z.string(),
  tratado: z.boolean().optional(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  imagens: z.array(z.string()),
});

export class AnomaliaDevolucaoDto extends createZodDto(
  anomaliaDevolucaoDtoSchema,
) {}
