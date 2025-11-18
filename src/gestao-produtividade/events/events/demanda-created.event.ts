import { Palete } from '../../domain/entities/palete.entity';

export class DemandaProdutividadeCreatedEvent {
  static readonly eventName = 'demanda-produtividade.created';

  constructor(public readonly paletes: Palete[]) {}
}
