import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const overViewProdutividadeResponseSchema = z.object({
  processos: z.number(),
  emAndamento: z.number(),
  concluidos: z.number(),
  totalCaixas: z.number(),
  totalUnidades: z.number(),
  produtividade: z.number(),
});

export type OverViewProdutividadeData = z.infer<
  typeof overViewProdutividadeResponseSchema
>;

export class OverViewProdutividadeDataDto extends createZodDto(
  overViewProdutividadeResponseSchema,
) {}
