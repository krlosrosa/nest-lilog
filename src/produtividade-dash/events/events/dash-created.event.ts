import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';
import { QueryFindDemanda } from 'src/produtividade-dash/dtos/queryFindDemanda';

type Props = {
  params: QueryFindDemanda;
  demanda: Demanda;
};

export class DashProdutividadeCreatedEvent {
  static readonly eventName = 'dash-produtividade.created';

  constructor(public readonly props: Props) {}
}
