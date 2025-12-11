import { Inject, NotFoundException } from '@nestjs/common';
import { type IPausaRepository } from '../../domain/repository/IPausa.repository';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';

export class FinalizarPausaIndividual {
  constructor(
    @Inject('IPausaRepository')
    private readonly pausaRepository: IPausaRepository,
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(paleteId: string): Promise<void> {
    const demanda = await this.demandaRepository.getDemandaByPaleteId(paleteId);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }

    demanda.validarSePodeFinalizarPausaIndividual();

    await this.pausaRepository.finalizar(demanda.id);
  }
}
