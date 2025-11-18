import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { ProdutividadeWithPausaAndPaleteDto } from '../dtos/produtividade/produtividade.model.dto';

@Injectable()
export class GetProdutividadeByIdUsecase {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly produtividadeRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(
    idDemanda: string,
  ): Promise<ProdutividadeWithPausaAndPaleteDto> {
    const demanda = await this.produtividadeRepository.findById(idDemanda);
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }
    return {
      idDemanda: demanda.id,
      empresa: demanda.empresa,
      centerId: demanda.centerId,
      processo: demanda.processo,
      segmento: demanda.segmento,
      inicio: demanda.inicio,
      fim: demanda.fim,
      cadastradoPorId: demanda.cadastradoPorId,
      turno: demanda.turno,
      funcionarioId: demanda.funcionarioId,
      nomeFuncionario: demanda.nomeFuncionario,
      statusDemanda: demanda.status,
      caixas: demanda.quantidadeCaixas(),
      unidades: demanda.quantidadeUnidades(),
      paletes: demanda.quantidadePaletes(),
      visitas: demanda.quantidadeVisitas(),
      pausas: demanda.quantidadePausas(),
      tempoTrabalhado: demanda.calcularTempoTrabalhado(),
      tempoPausas: demanda.calcularTempoPausas(),
      tempoTotal: demanda.calcularTempoTotal(),
      produtividade: demanda.calcularProdutividade(),
      obs: demanda.obs,
      listaPausas: demanda.listaPausas.map((pausa) => {
        return {
          id: pausa.id,
          inicio: pausa.inicio,
          fim: pausa.fim,
          motivo: pausa.motivo ?? '',
          descricao: pausa.descricao,
          demandaId: pausa.demandaId,
          registradoPorId: pausa.cadastradoPorId,
        };
      }),
      listaPaletes: demanda.listaPaletes.map((palete) => {
        return {
          id: palete.id,
          empresa: palete.empresa,
          quantidadeCaixas: palete.quantidadeCaixas,
          quantidadeUnidades: palete.quantidadeUnidades,
          quantidadePaletes: palete.quantidadePaletes,
          enderecoVisitado: palete.enderecoVisitado,
          segmento: palete.segmento,
          transporteId: palete.transporteId,
          inicio: palete.inicio,
          fim: palete.fim,
          tipoProcesso: palete.tipoProcesso,
          criadoEm: palete.criadoEm,
          atualizadoEm: palete.atualizadoEm,
          demandaId: palete.demandaId,
          status: palete.status,
          validado: palete.validado,
          criadoPorId: palete.criadoPorId,
        };
      }),
    };
  }
}
