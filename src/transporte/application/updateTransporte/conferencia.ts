import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DemandaProcesso } from 'src/_shared/enums';
import { TransporteStatus } from 'src/_shared/enums/transporte-status.enum';
import { Transporte } from 'src/transporte/domain/entities/transporte.entity';
import { type ITransporteRepository } from 'src/transporte/domain/repository/ITransporte.interface';
import { TransporteHistoricoUpdatedEvent } from 'src/transporte/events/events/transporteHistorico-update.event';

@Injectable()
export class UpdateTransporteConferencia {
  constructor(
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    transporteEntity: Transporte,
    status: TransporteStatus,
  ): Promise<void> {
    const transporte =
      await this.transporteRepository.findTransporteByNumeroTransporte(
        transporteEntity.numeroTransporte,
      );
    if (transporte) {
      const statusTransporte = transporte.conferencia;
      if (
        (statusTransporte as TransporteStatus) !== status &&
        status !== TransporteStatus.NAO_INICIADO
      ) {
        await this.transporteRepository.updateTransporte(
          transporteEntity.numeroTransporte,
          {
            conferencia: status,
          },
        );
        this.eventEmitter.emit(
          TransporteHistoricoUpdatedEvent.eventName,
          new TransporteHistoricoUpdatedEvent({
            transporte: transporteEntity,
            processo: DemandaProcesso.CONFERENCIA,
            status: status,
          }),
        );
      }
    }
  }
}
