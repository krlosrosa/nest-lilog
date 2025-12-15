import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const resumoContagemLiteSchema = z.object({
  endereco_base: z.string(),
  total_enderecos: z.number(),
  enderecos_validados: z.number(),
});

export class ResumoContagemLiteDto extends createZodDto(
  resumoContagemLiteSchema,
) {}
