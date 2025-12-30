import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const StatusSchema = z.object({
  nome: z.string(),
  id: z.number(),
});

export const OrigemSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nome: z.string(),
  razaoSocial: z.any().nullable(),
  cnpj: z.any().nullable(),
  latitude: z.number(),
  longitude: z.number(),
});

export const MotoristaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string(),
});

export const EmbarcadorSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cnpj: z.string(),
  ehEmbarcador: z.boolean(),
  ehUnidade: z.boolean(),
  ehCooperativa: z.boolean(),
  ehTransportador: z.boolean(),
});

export const UnidadeSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cnpj: z.string(),
  ehEmbarcador: z.boolean(),
  ehUnidade: z.boolean(),
  ehCooperativa: z.boolean(),
  ehTransportador: z.boolean(),
});

export const CooperativaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cnpj: z.string(),
  ehEmbarcador: z.boolean(),
  ehUnidade: z.boolean(),
  ehCooperativa: z.boolean(),
  ehTransportador: z.boolean(),
});

export const TransportadoraSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cnpj: z.string(),
  ehEmbarcador: z.boolean(),
  ehUnidade: z.boolean(),
  ehCooperativa: z.boolean(),
  ehTransportador: z.boolean(),
});

export const VeiculoSchema = z.object({
  id: z.number(),
  placa: z.string(),
});

export const OperadorSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export const RavexResponseViagemDataSchema = z.object({
  id: z.number(),
  identificador: z.string(),
  estimativaInicio: z.string(),
  estimativaFim: z.string(),
  inicioDataHora: z.string(),
  fimDataHora: z.string(),
  temperaturaMinima: z.number(),
  temperaturaMaxima: z.number(),
  produto: z.string(),
  observacoes: z.string(),
  tipo: z.string(),
  pesoBrutoTotal: z.number(),
  pesoLiquidoTotal: z.number(),
  valor: z.number(),
  numeroOrdemCarregamento: z.string(),
  kmEstimado: z.number(),
  quantidadeCaixas: z.number(),
  possuiOrdemEspecial: z.boolean(),
  inicioCarregamento: z.any().nullable(),
  fimCarregamento: z.any().nullable(),
  inicioPreFrio: z.any().nullable(),
  computarIndicador: z.boolean(),
  status: StatusSchema,
  origem: OrigemSchema,
  destino: z.any().nullable(),
  tabelaFrete: z.any().nullable(),
  motorista: MotoristaSchema,
  embarcador: EmbarcadorSchema,
  unidade: UnidadeSchema,
  cooperativa: CooperativaSchema,
  transportadora: TransportadoraSchema,
  veiculo: VeiculoSchema,
  projeto: z.any().nullable(),
  hodometroInicio: z.any().nullable(),
  hodometroFim: z.any().nullable(),
  eficienciaTemperatura: z.number(),
  operador: OperadorSchema,
});

export const RavexResponseViagemSchema = z.object({
  success: z.boolean(),
  data: RavexResponseViagemDataSchema,
  errors: z.any(),
});

export class RavexResponseViagemDtoResponse extends createZodDto(
  RavexResponseViagemSchema,
) {}
