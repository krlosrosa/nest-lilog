import { Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { DemandaProdutividadeCreatedEvent } from '../../events/events/demanda-created.event';
import { TransporteUpdatedEvent } from 'src/transporte/events/events/transporte-update.event';

export class FinalizarPaleteProdutividade {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(paleteIds: string[]): Promise<void> {
    const paletes = await this.demandaRepository.findPaletes(paleteIds);
    if (paletes.length === 0) {
      throw new NotFoundException(`Paletes não encontrados`);
    }
    paletes.forEach((palete) => {
      palete.validarSePodeSerFinalizado();
    });

    await this.demandaRepository.finalizarPalete(paletes);

    this.eventEmitter.emit(
      TransporteUpdatedEvent.eventName,
      new TransporteUpdatedEvent({
        transporteIds: paletes.map((palete) => palete.transporteId),
        processo: paletes[0].tipoProcesso,
      }),
    );

    this.eventEmitter.emit(
      DemandaProdutividadeCreatedEvent.eventName,
      new DemandaProdutividadeCreatedEvent(paletes),
    );
  }
}
