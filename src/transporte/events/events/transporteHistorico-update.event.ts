import { DemandaProcesso } from 'src/_shared/enums';
import { TransporteStatus } from 'src/_shared/enums/transporte-status.enum';
import { Transporte } from 'src/transporte/domain/entities/transporte.entity';

export type TransporteHistoricoUpdatedEventData = {
  transporte: Transporte;
  processo: DemandaProcesso;
  status: TransporteStatus;
};

export class TransporteHistoricoUpdatedEvent {
  static readonly eventName = 'transporteHistorico.updated';

  constructor(public readonly data: TransporteHistoricoUpdatedEventData) {}
}
