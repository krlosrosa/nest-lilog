import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Área
export const RavexAreaSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export const RavexArea2Schema = z.object({
  id: z.number(),
  nome: z.string(),
});

// Setor
export const RavexSetorSchema = z.object({
  id: z.number(),
  nome: z.string(),
  area: RavexAreaSchema,
});

export const RavexSetor2Schema = z.object({
  id: z.number(),
  nome: z.string(),
  area: RavexArea2Schema,
});

// Motivo
export const RavexMotivoSchema = z.object({
  id: z.number(),
  descricao: z.string(),
  codigo: z.string(),
  setor: RavexSetorSchema,
});

export const RavexMotivo2Schema = z.object({
  id: z.number(),
  descricao: z.string(),
  codigo: z.string(),
  setor: RavexSetor2Schema,
});

// Operador
export const RavexOperadorSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

// Itens
export const RavexItenSchema = z.object({
  codigo: z.string(),
  itemId: z.number(),
  quantidadeDevolvida: z.number(),
  pesoBrutoDevolvido: z.number(),
  pesoLiquidoDevolvido: z.number(),
  notaFiscalDevolucao: z.any().nullable(),
  serieNotaFiscalDevolucao: z.any().nullable(),
  motivo: RavexMotivo2Schema,
});

// Entity
export const RavexEntitySchema = z.object({
  tipoRetorno: z.number(),
  senhaControle: z.string(),
  observacao: z.any().nullable(),
  numeroNotaFiscal: z.string(),
  serieNotaFiscal: z.string(),
  devolucaoContabil: z.boolean(),
  latitude: z.any().nullable(),
  longitude: z.any().nullable(),
  dataHoraOcorrencia: z.string(),
  dataHoraAceite: z.string(),
  usuario: z.any().nullable(),
  operador: RavexOperadorSchema,
  motivo: RavexMotivoSchema,
  itens: z.array(RavexItenSchema),
});

// Response
export const RavexResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(RavexEntitySchema),
  errors: z.any().nullable(),
});

export class RavexResponseDto extends createZodDto(RavexResponseSchema) {}
