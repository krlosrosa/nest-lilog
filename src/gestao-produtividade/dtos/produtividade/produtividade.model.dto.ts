import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const ProdutividadeSchema = z.object({
  idDemanda: z.number(),
  empresa: z.string(),
  centerId: z.string(),
  processo: z.string(), // ou z.nativeEnum(TipoProcesso) se for enum
  segmento: z.string(),
  inicio: z.string(),
  fim: z.string().nullable(),
  cadastradoPorId: z.string(),
  turno: z.string(), // ou z.nativeEnum(Turno) se for enum
  funcionarioId: z.string(),
  nomeFuncionario: z.string(),
  statusDemanda: z.string(),
  caixas: z.number(),
  unidades: z.number(),
  paletes: z.number(),
  visitas: z.number(),
  pausas: z.number(),
  tempoTrabalhado: z.number(),
  tempoPausas: z.number(),
  tempoTotal: z.number(),
  produtividade: z.number(),
  obs: z.string().nullable(),
});

const schemaPausa = z.object({
  id: z.number(),
  inicio: z.string(),
  fim: z.string().nullable(),
  motivo: z.string(),
  descricao: z.string().nullable(),
  demandaId: z.number(),
  registradoPorId: z.string(),
});

const schemaPalete = z.object({
  id: z.string(),
  empresa: z.string(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  quantidadePaletes: z.number(),
  enderecoVisitado: z.number(),
  segmento: z.string(),
  transporteId: z.string(),
  inicio: z.string().nullable(),
  fim: z.string().nullable(),
  tipoProcesso: z.string(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
  demandaId: z.number().nullable(),
  status: z.string(),
  validado: z.boolean(),
  criadoPorId: z.string(),
});

export type ProdutividadeGetData = z.infer<typeof ProdutividadeSchema>;

export class ProdutividadeGetDataDto extends createZodDto(
  ProdutividadeSchema,
) {}

const ProdutividadeWithPausaAndPaleteSchema = ProdutividadeSchema.extend({
  listaPausas: z.array(schemaPausa),
  listaPaletes: z.array(schemaPalete),
});

export class ProdutividadeWithPausaAndPaleteDto extends createZodDto(
  ProdutividadeWithPausaAndPaleteSchema,
) {}
