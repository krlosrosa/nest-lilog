import { Inject, NotFoundException } from '@nestjs/common';
import { type IPausaRepository } from '../../domain/repository/IPausa.repository';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { PausaCreateDataDto } from '../../dtos/pausa/pausa.create.dto';
import { Pausa } from '../../domain/entities/pausa.entity';

export class AddPausaIndividual {
  constructor(
    @Inject('IPausaRepository')
    private readonly pausaRepository: IPausaRepository,
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(
    paleteId: string,
    pausaData: PausaCreateDataDto,
    registradoPorId: string,
  ): Promise<void> {
    const demanda = await this.demandaRepository.getDemandaByPaleteId(paleteId);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }

    demanda.validarSePodePausarIndividual();

    const pausa = Pausa.create({
      ...pausaData,
      demandaId: demanda.id,
      registradoPorId: registradoPorId,
      inicio: new Date().toISOString(),
    });

    await this.pausaRepository.create(pausa.dataInput());
  }
}
