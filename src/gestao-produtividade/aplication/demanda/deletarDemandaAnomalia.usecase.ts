import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';

@Injectable()
export class DeletarDemandaAnomaliaUsecase {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(idDemanda: string): Promise<void> {
    const demanda = await this.demandaRepository.findById(idDemanda);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }

    if (demanda.paletes.length > 0) {
      throw new BadRequestException(
        'Demanda não pode ser deletada, pois possui paletes',
      );
    }

    await this.demandaRepository.delete(demanda.id);
  }
}
