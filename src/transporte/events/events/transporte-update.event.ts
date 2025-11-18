import { DemandaProcesso } from 'src/_shared/enums';

export type TransporteUpdatedEventData = {
  transporteIds: string[];
  processo: DemandaProcesso;
};

export class TransporteUpdatedEvent {
  static readonly eventName = 'transporte.updated';

  constructor(public readonly data: TransporteUpdatedEventData) {}
}
