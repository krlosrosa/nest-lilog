import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProdutividadeDashService } from 'src/produtividade-dash/produtividade-dash.service';
import { DashUserProdutividadeCreatedEvent } from '../events/dash-user-created.event';

@Injectable()
export class ProdutividadeUserListener {
  constructor(
    @Inject(ProdutividadeDashService)
    private readonly produtividadeDashService: ProdutividadeDashService,
  ) {}

  @OnEvent(DashUserProdutividadeCreatedEvent.eventName)
  async handleDashUserProdutividadeCreatedEvent(
    event: DashUserProdutividadeCreatedEvent,
  ): Promise<void> {
    await this.produtividadeDashService.atualizarProdutividadePorUsuario(
      event.props.params,
      event.props.demanda,
    );
  }
}
