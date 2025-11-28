import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export enum StatusPalete {
  NAO_INICIADO = 'NAO_INICIADO',
  EM_PROGRESSO = 'EM_PROGRESSO',
  CONCLUIDO = 'CONCLUIDO',
  EM_PAUSA = 'EM_PAUSA',
}
export const TransporteSchema = z.object({
  numeroTransporte: z.string(),
  status: z
    .enum([
      'AGUARDANDO_SEPARACAO',
      'EM_SEPARACAO',
      'SEPARACAO_CONCLUIDA',
      'EM_CONFERENCIA',
      'CONFERENCIA_CONCLUIDA',
      'EM_CARREGAMENTO',
      'CARREGAMENTO_CONCLUIDO',
      'FATURADO',
      'LIBERADO_PORTARIA',
      'CANCELADO',
    ])
    .default('AGUARDANDO_SEPARACAO'),
  nomeRota: z.string().nonempty('nomeRota é obrigatório'),
  nomeTransportadora: z.string().nonempty('nomeTransportadora é obrigatório'),
  placa: z.string().nonempty('placa é obrigatório'),
  criadoEm: z.string().nonempty('criadoEm é obrigatório'),
  atualizadoEm: z.string().nonempty('atualizadoEm é obrigatório'),
  cadastradoPorId: z.string().nonempty('cadastradoPorId é obrigatório'),
  dataExpedicao: z.string().nonempty('dataExpedicao é obrigatório'),
  centerId: z.string().nonempty('centerId é obrigatório'),
  obs: z.string().nullable(),
  prioridade: z.number().optional(),
  cargaParada: z.boolean().optional(),
  carregamento: z.nativeEnum(StatusPalete).optional(),
  conferencia: z.nativeEnum(StatusPalete).optional(),
  separacao: z.nativeEnum(StatusPalete).optional(),
  qtdImpressoes: z.number().optional(),
});

export class ResultTransporteDto extends createZodDto(TransporteSchema) {}
