import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { DemandaStatus } from 'src/_shared/enums';

@Injectable()
export class DeletarDemandaUsecase {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(paleteId: string): Promise<void> {
    const demanda = await this.demandaRepository.getDemandaByPaleteId(paleteId);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }

    if (demanda.status !== DemandaStatus.EM_PROGRESSO) {
      throw new BadRequestException(
        'Demanda não pode ser deletada, pois não está em progresso',
      );
    }

    await this.demandaRepository.delete(demanda.id);
  }
}
