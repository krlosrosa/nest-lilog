import { Inject, NotFoundException } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from 'src/gestao-produtividade/domain/repository/IDemandaProdutividade.repository';
import { DemandaDto } from 'src/gestao-produtividade/dtos/produtividade/demanda.dto';

export default class GetDemandaUsecase {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(idDemanda: string): Promise<DemandaDto> {
    const demanda = await this.demandaRepository.findById(idDemanda);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }
    return {
      idDemanda: demanda.id,
      centerId: demanda.centerId,
      processo: demanda.processo,
      status: demanda.status,
      funcionarioId: demanda.funcionarioId,
      dataExpedicao: demanda.dataExpedicao,
      paletes: demanda.paletes.map((palete) => {
        return {
          id: palete.id,
          empresa: palete.empresa,
          quantidadeCaixas: palete.quantidadeCaixas,
          quantidadeUnidades: palete.quantidadeUnidades,
          quantidadePaletes: palete.quantidadePaletes,
          enderecoVisitado: palete.enderecoVisitado,
          transporteId: palete.transporteId,
          tipoProcesso: palete.tipoProcesso,
          status: palete.status,
        };
      }),
    };
  }
}
