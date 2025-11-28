import { Inject, Injectable } from '@nestjs/common';
import { TransporteUpdatedEventData } from '../events/events/transporte-update.event';
import { type ITransporteRepository } from '../domain/repository/ITransporte.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransporteHistoricoUpdatedEvent } from '../events/events/transporteHistorico-update.event';
import { DemandaProcesso } from 'src/_shared/enums';
import { TransporteAnomaliaUpdatedEvent } from 'src/anomalias-produtividade/events/demanda-update-transporte';

@Injectable()
export class AtualizarStatusTransportes {
  constructor(
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(data: TransporteUpdatedEventData): Promise<void> {
    const transportes =
      await this.transporteRepository.findTransportesByTransporteIds(
        data.transporteIds,
        data.processo,
      );
    for (const transporte of transportes) {
      const statusConferencia = transporte.statusConferencia;
      const statusCarregamento = transporte.statusCarregamento;
      const statusSeparacao = transporte.statusSeparacao;
      const updatedData = transporte.updateStatus(data.processo);
      if (updatedData) {
        if (
          statusSeparacao !== updatedData.separacao &&
          updatedData.separacao !== undefined
        ) {
          this.eventEmitter.emit(
            TransporteHistoricoUpdatedEvent.eventName,
            new TransporteHistoricoUpdatedEvent({
              transporte: transporte,
              processo: DemandaProcesso.SEPARACAO,
              status: transporte.statusSeparacao,
            }),
          );
        }
        if (
          statusConferencia !== updatedData.conferencia &&
          updatedData.conferencia !== undefined
        ) {
          this.eventEmitter.emit(
            TransporteHistoricoUpdatedEvent.eventName,
            new TransporteHistoricoUpdatedEvent({
              transporte: transporte,
              processo: DemandaProcesso.CONFERENCIA,
              status: transporte.statusConferencia,
            }),
          );
        }
        if (
          statusCarregamento !== updatedData.carregamento &&
          updatedData.carregamento !== undefined
        ) {
          this.eventEmitter.emit(
            TransporteHistoricoUpdatedEvent.eventName,
            new TransporteHistoricoUpdatedEvent({
              transporte: transporte,
              processo: DemandaProcesso.CARREGAMENTO,
              status: transporte.statusCarregamento,
            }),
          );
        }
        await this.transporteRepository.updateTransporte(
          transporte.numeroTransporte,
          updatedData,
        );
      }
    }
    this.eventEmitter.emit(
      TransporteAnomaliaUpdatedEvent.eventName,
      new TransporteAnomaliaUpdatedEvent({
        transporteId: transportes[0].numeroTransporte,
        centerId: 'pavuna',
      }),
    );
  }
}
