import { Inject } from '@nestjs/common';
import { type ITransporteRepository } from '../domain/repository/ITransporte.interface';
import { TransporteHistoricoUpdatedEventData } from '../events/events/transporteHistorico-update.event';
import { DemandaProcesso } from 'src/_shared/enums';
import { TransporteStatus } from 'src/_shared/enums/transporte-status.enum';

export class AdicionarHistorioTransporte {
  constructor(
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
  ) {}

  async execute(data: TransporteHistoricoUpdatedEventData): Promise<void> {
    const tipoEvento = getTipoEvento(data.processo, data.status);
    if (tipoEvento) {
      await this.transporteRepository.createHistoricoTransporte({
        tipoEvento: tipoEvento,
        descricao: '',
        processo: data.processo,
        transporteId: data.transporte.numeroTransporte,
        alteradoPorId: data.transporte.alteradoPorId,
        alteradoEm: new Date().toISOString(),
      });
    }
  }
}

export function getTipoEvento(
  processo: DemandaProcesso,
  status: TransporteStatus,
): TipoEvento | undefined {
  const eventosMap: Record<
    DemandaProcesso,
    Partial<Record<TransporteStatus, TipoEvento>>
  > = {
    [DemandaProcesso.SEPARACAO]: {
      [TransporteStatus.EM_PROGRESSO]: TipoEvento.INICIO_SEPARACAO,
      [TransporteStatus.CONCLUIDO]: TipoEvento.TERMINO_SEPARACAO,
    },
    [DemandaProcesso.CONFERENCIA]: {
      [TransporteStatus.EM_PROGRESSO]: TipoEvento.INICIO_CONFERENCIA,
      [TransporteStatus.CONCLUIDO]: TipoEvento.TERMINO_CONFERENCIA,
    },
    [DemandaProcesso.CARREGAMENTO]: {
      [TransporteStatus.EM_PROGRESSO]: TipoEvento.INICIO_CARREGAMENTO,
      [TransporteStatus.CONCLUIDO]: TipoEvento.TERMINO_CARREGAMENTO,
    },
  };

  return eventosMap[processo]?.[status];
}

export enum TipoEvento {
  CRIACAO_TRANSPORTE = 'CRIACAO_TRANSPORTE',
  INICIO_SEPARACAO = 'INICIO_SEPARACAO',
  TERMINO_SEPARACAO = 'TERMINO_SEPARACAO',
  INICIO_CONFERENCIA = 'INICIO_CONFERENCIA',
  TERMINO_CONFERENCIA = 'TERMINO_CONFERENCIA',
  INICIO_CARREGAMENTO = 'INICIO_CARREGAMENTO',
  TERMINO_CARREGAMENTO = 'TERMINO_CARREGAMENTO',
  CORTE_PRODUTO = 'CORTE_PRODUTO',
  FATURADO = 'FATURADO',
  LIBERADO_PORTARIA = 'LIBERADO_PORTARIA',
}
