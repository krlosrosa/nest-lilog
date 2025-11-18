import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransporteUpdatedEvent } from '../events/transporte-update.event';
import { AtualizarStatusTransportes } from 'src/transporte/application/atualizarStatusTransportes.usecase';
import { TransporteHistoricoUpdatedEvent } from '../events/transporteHistorico-update.event';
import { AdicionarHistorioTransporte } from 'src/transporte/application/adicionarHistorioTransporte.ts.usecase';

@Injectable()
export class TransporteListener {
  constructor(
    @Inject(AtualizarStatusTransportes)
    private readonly atualizarStatusTransportes: AtualizarStatusTransportes,
    @Inject(AdicionarHistorioTransporte)
    private readonly adicionarHistorioTransporte: AdicionarHistorioTransporte,
  ) {}
  @OnEvent(TransporteUpdatedEvent.eventName)
  async handleTransporteUpdatedEvent(
    event: TransporteUpdatedEvent,
  ): Promise<void> {
    await this.atualizarStatusTransportes.execute(event.data);
  }

  @OnEvent(TransporteHistoricoUpdatedEvent.eventName)
  async handleTransporteHistoricoUpdatedEvent(
    event: TransporteHistoricoUpdatedEvent,
  ): Promise<void> {
    await this.adicionarHistorioTransporte.execute(event.data);
  }
}
