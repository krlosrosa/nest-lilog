import { Inject } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { OverViewProdutividadeDataDto } from '../dtos/produtividade/produtivididade.overView.dto';
import { DemandaProcesso } from 'src/_shared/enums';

export class OverViewProdutividade {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(
    centerId: string,
    processo: DemandaProcesso,
    dataRegistro: string,
  ): Promise<OverViewProdutividadeDataDto> {
    const demandas = await this.demandaRepository.overViewProdutividade(
      centerId,
      processo,
      dataRegistro,
    );
    return demandas;
  }
}
