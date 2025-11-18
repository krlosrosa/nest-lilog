import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DashProdutividadeCreatedEvent } from '../events/dash-created.event';
import { ProdutividadeDashService } from 'src/produtividade-dash/produtividade-dash.service';

@Injectable()
export class ProdutividadeListener {
  constructor(
    @Inject(ProdutividadeDashService)
    private readonly produtividadeDashService: ProdutividadeDashService,
  ) {}

  @OnEvent(DashProdutividadeCreatedEvent.eventName)
  async handleDashProdutividadeCreatedEvent(
    event: DashProdutividadeCreatedEvent,
  ): Promise<void> {
    await this.produtividadeDashService.atualizarProdutividadePorCentro(
      event.props.params,
      event.props.demanda,
    );
  }
}
