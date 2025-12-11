import { Inject } from '@nestjs/common';
import { type IPausaRepository } from '../../domain/repository/IPausa.repository';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';

export class FinalizarPausaGeral {
  constructor(
    @Inject('IPausaRepository')
    private readonly pausaRepository: IPausaRepository,
  ) {}

  async execute(
    centerId: string,
    segmento: string,
    turno: DemandaTurno,
    processo: DemandaProcesso,
  ): Promise<void> {
    const pausasGerais = await this.pausaRepository.findAll(centerId, {
      ativo: 'true',
      segmento,
      turno,
      processo,
    });

    if (pausasGerais.length === 0) {
      return;
    }

    const ids = pausasGerais.map((pausa) => pausa.id);

    await this.pausaRepository.finalizarPausaGeral(ids);
  }
}
