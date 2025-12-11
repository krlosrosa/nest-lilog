import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DemandaProdutividadeCreatedEvent } from '../events/demanda-created.event';
import { AtualizarDemandaProdutividade } from '../../aplication/demanda/atualizarDemanda.usecase';

@Injectable()
export class ProdutividadeListener {
  constructor(
    @Inject(AtualizarDemandaProdutividade)
    private readonly atualizarDemanda: AtualizarDemandaProdutividade,
  ) {}
  @OnEvent(DemandaProdutividadeCreatedEvent.eventName)
  async handleDemandaProdutividadeCreatedEvent(
    event: DemandaProdutividadeCreatedEvent,
  ): Promise<void> {
    await this.atualizarDemanda.execute(event.paletes);
  }
}
