import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AnomaliasProdutividadeService } from '../anomalias-produtividade.service';
import { DemandaProdutividadeFinishAnomalyEvent } from './demanda-finish.event';
import { TransporteAnomaliaUpdatedEvent } from './demanda-update-transporte';

@Injectable()
export class AnomaliaListener {
  constructor(
    @Inject(AnomaliasProdutividadeService)
    private readonly anomaliaService: AnomaliasProdutividadeService,
  ) {}
  @OnEvent(DemandaProdutividadeFinishAnomalyEvent.eventName)
  async handleDemandaProdutividadeFinishAnomalyEvent(
    event: DemandaProdutividadeFinishAnomalyEvent,
  ): Promise<void> {
    return this.anomaliaService.verificarAnomalias(event.demanda);
  }
  @OnEvent(TransporteAnomaliaUpdatedEvent.eventName)
  async handleTransporteAnomaliaUpdatedEvent(
    event: TransporteAnomaliaUpdatedEvent,
  ): Promise<void> {
    return this.anomaliaService.verificarAnomaliasTransporte(
      event.data.transporteId,
      event.data.centerId,
    );
  }
}
