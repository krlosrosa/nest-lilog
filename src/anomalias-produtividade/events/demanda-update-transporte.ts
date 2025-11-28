export type TransporteAnomaliaUpdatedEventData = {
  transporteId: string;
  centerId: string;
};

export class TransporteAnomaliaUpdatedEvent {
  static readonly eventName = 'transporte.anomalia.updated';

  constructor(public readonly data: TransporteAnomaliaUpdatedEventData) {}
}
