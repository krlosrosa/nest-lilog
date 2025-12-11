import { Inject } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { Palete } from '../../domain/entities/palete.entity';
import { Demanda } from '../../domain/entities/demanda.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DashProdutividadeCreatedEvent } from 'src/produtividade-dash/events/events/dash-created.event';
import { DashUserProdutividadeCreatedEvent } from 'src/produtividade-dash/events/events/dash-user-created.event';
import { DemandaProdutividadeFinishAnomalyEvent } from 'src/anomalias-produtividade/events/demanda-finish.event';

export class AtualizarDemandaProdutividade {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(paletes: Palete[]): Promise<void> {
    const demandaIds = paletes
      .map((palete) => palete.demandaId)
      .filter((demandaId) => demandaId !== null);
    if (demandaIds.length === 0) {
      return;
    }
    const demandas = await this.demandaRepository.findAll({
      demandaIds: demandaIds,
    });

    const demandasFinalizadas: Demanda[] = [];

    demandas.forEach((demanda) => {
      if (demanda.validarSePaletesFinalizados()) {
        demanda.finalizarDemanda();
        demandasFinalizadas.push(demanda);
        this.eventEmitter.emit(
          DashProdutividadeCreatedEvent.eventName,
          new DashProdutividadeCreatedEvent({
            demanda: demanda,
            params: {
              centerId: demanda.centerId,
              cluster: 'distribuicao',
              empresa: demanda.empresa,
              processo: demanda.processo,
              turno: demanda.turno,
              dataRegistro: demanda.dataExpedicao,
            },
          }),
        );
        this.eventEmitter.emit(
          DashUserProdutividadeCreatedEvent.eventName,
          new DashUserProdutividadeCreatedEvent({
            demanda: demanda,
            params: {
              funcionarioId: demanda.funcionarioId,
              centerId: demanda.centerId,
              processo: demanda.processo,
              turno: demanda.turno,
              dataRegistro: demanda.dataExpedicao,
            },
          }),
        );
      }
    });

    await this.demandaRepository.finalizarDemandas(demandasFinalizadas);

    this.eventEmitter.emit(
      DemandaProdutividadeFinishAnomalyEvent.eventName,
      new DemandaProdutividadeFinishAnomalyEvent(demandasFinalizadas[0]),
    );
  }
}
