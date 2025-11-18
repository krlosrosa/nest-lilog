import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';
import { QueryFindUserDashboard } from 'src/produtividade-dash/dtos/queryFindDemanda';

type Props = {
  params: QueryFindUserDashboard;
  demanda: Demanda;
};

export class DashUserProdutividadeCreatedEvent {
  static readonly eventName = 'dash-user-produtividade.created';

  constructor(public readonly props: Props) {}
}
