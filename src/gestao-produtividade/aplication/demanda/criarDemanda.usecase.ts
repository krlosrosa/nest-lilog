import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { DemandaCreateDataComPaletesIds } from '../../dtos/demanda/demanda.create.dto';
import { DemandaStatus } from 'src/_shared/enums';
import { Demanda } from '../../domain/entities/demanda.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransporteUpdatedEvent } from 'src/transporte/events/events/transporte-update.event';

@Injectable()
export class CriarDemandaProdutividade {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    params: DemandaCreateDataComPaletesIds,
    cadastradoPorId: string,
  ): Promise<void> {
    const demandasPorFuncionario = await this.demandaRepository.findAll({
      funcionarioId: params.funcionarioId,
      status: [DemandaStatus.EM_PROGRESSO, DemandaStatus.PAUSA],
    });

    if (demandasPorFuncionario.length > 0) {
      demandasPorFuncionario.forEach((demanda) => {
        if (!demanda.validarRestricoesPorFuncionario()) {
          throw new BadRequestException(
            'Funcionário não pode iniciar nova demanda.',
          );
        }
      });
    }

    const paletes = await this.demandaRepository.findPaletes(params.paletesIds);

    if (paletes.length > 0) {
      paletes.forEach((palete) => {
        if (palete.demandaId) {
          throw new BadRequestException(
            `Palete ${palete.id} já está alocado na demanda ${palete.demandaId}`,
          );
        }
      });
    } else {
      throw new BadRequestException(
        'Necessário pelo menos um palete para iniciar o processo',
      );
    }

    const demanda = Demanda.create({
      ...params,
      inicio: new Date().toISOString(),
      cadastradoPorId: cadastradoPorId,
      status: DemandaStatus.EM_PROGRESSO,
      dataExpedicao: params.dataExpedicao,
      processo: paletes[0].tipoProcesso,
    });

    await this.demandaRepository.create(demanda, params.paletesIds);

    this.eventEmitter.emit(
      TransporteUpdatedEvent.eventName,
      new TransporteUpdatedEvent({
        transporteIds: paletes.map((palete) => palete.transporteId),
        processo: paletes[0].tipoProcesso,
      }),
    );
  }
}
