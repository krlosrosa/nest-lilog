import { BadRequestException, Inject } from '@nestjs/common';
import { type IPausaRepository } from '../../domain/repository/IPausa.repository';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { DemandaStatus, DemandaTurno } from 'src/_shared/enums';
import { PausaGeralCreateDataDto } from '../../dtos/pausaGeral/pausaGeral.create.dto';

export class AddPausaGeral {
  constructor(
    @Inject('IPausaRepository')
    private readonly pausaRepository: IPausaRepository,
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(
    params: PausaGeralCreateDataDto,
    registradoPorId: string,
  ): Promise<void> {
    const pausaGeral = await this.pausaRepository.findPausaGeralByParams({
      segmento: params.segmento as 'CONFERENCIA' | 'SEPARACAO' | 'CARREGAMENTO',
      processo: params.processo,
      turno: params.turno,
      centerId: params.centerId,
    });

    if (pausaGeral) {
      throw new BadRequestException('Pausa geral já existe');
    }

    const demandas = await this.demandaRepository.findAll({
      centerId: params.centerId,
      turno: params.turno as DemandaTurno,
      segmento: params.segmento,
      status: [DemandaStatus.EM_PROGRESSO],
    });

    const demandaIds = demandas.map((demanda) => demanda.id);

    await this.pausaRepository.criarPausaGeral(
      registradoPorId,
      params,
      demandaIds,
    );
  }
}
