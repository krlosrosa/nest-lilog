import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ItensContabilDtoSchema = z.object({
  demandaId: z.number(),
  sku: z.string(),
  descricao: z.string(),
  tipo: z.enum(['CONTABIL', 'FISICO']),
  tipoDevolucao: z.enum(['RETORNO', 'REENTREGA']),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  avariaCaixas: z.number(),
  avariaUnidades: z.number(),
});

export class ItensContabilDto extends createZodDto(ItensContabilDtoSchema) {}

export type EntradaDto = {
  id: number;
  descricao: string;
  lote: string | null;
  demandaId: number;
  quantidadeCaixas: number | null;
  quantidadeUnidades: number | null;
  tipo: 'CONTABIL' | 'FISICO';
  sku: string;
  fabricacao: string | null;
  sif: string | null;
  devolucaoNotasId: string | null;
  avariaCaixas: number | null;
  avariaUnidades: number | null;
  tipoDevolucao: 'RETORNO' | 'REENTREGA';
  notaId: number | null;
};
