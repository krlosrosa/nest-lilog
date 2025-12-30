import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { TipoDevolucaoNotas } from 'src/_shared/enums/devolucao/devolucao.type';

const notasSchema = z.object({
  notaFiscal: z.string(),
  notaFiscalParcial: z.string(),
  descMotivoDevolucao: z.string(),
  viagemId: z.string(),
  tipo: z.nativeEnum(TipoDevolucaoNotas),
});

export type NotasDto = z.infer<typeof notasSchema>;

const itensSchema = z.object({
  sku: z.string(),
  descricao: z.string(),
  quantidadeCaixasContabil: z.number(),
  quantidadeUnidadesContabil: z.number(),
  quantidadeCaixasFisico: z.number(),
  quantidadeUnidadesFisico: z.number(),
  saldoCaixas: z.number(),
  saldoUnidades: z.number(),
  avariaCaixas: z.number(),
  avariaUnidades: z.number(),
});

export type ItensDto = z.infer<typeof itensSchema>;

const ResultadoDemandaSchema = z.object({
  demandaId: z.number(),
  placa: z.string(),
  motorista: z.string(),
  transportadora: z.string(),
  doca: z.string(),
  criadoPor: z.string(),
  conferente: z.string(),
  criadoEm: z.string(),
  LiberadoParaConferenciaEm: z.string(),
  InicioConferenciaEm: z.string(),
  FimConferenciaEm: z.string(),
  FinalizadoEm: z.string(),
  Status: z.string(),
  FechouComAnomalia: z.boolean(),
  notas: z.array(notasSchema),
  itens: z.array(itensSchema),
});

export class ResultadoDemandaDto extends createZodDto(ResultadoDemandaSchema) {}
