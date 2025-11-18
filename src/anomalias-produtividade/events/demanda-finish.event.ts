import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';

export class DemandaProdutividadeFinishAnomalyEvent {
  static readonly eventName = 'demanda-produtividade.finish-anomaly';

  constructor(public readonly demanda: Demanda) {}
}
