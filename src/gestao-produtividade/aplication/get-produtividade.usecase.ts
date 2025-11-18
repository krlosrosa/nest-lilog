import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { FindAllParams } from '../dtos/params.dto';
import { ProdutividadeGetDataDto } from '../dtos/produtividade/produtividade.model.dto';

@Injectable()
export class GetProdutividadeUsecase {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly produtividadeRepository: IDemandaProdutividadeRepository,
  ) {}

  async execute(
    centerId: string,
    params: FindAllParams,
  ): Promise<ProdutividadeGetDataDto[]> {
    if (!params.dataInicio && !params.dataRegistro) {
      throw new BadRequestException(
        'Data de registro ou data de início são obrigatórias',
      );
    }
    const demandas = await this.produtividadeRepository.findAll({
      ...params,
      centerId,
    });
    return demandas.map((demanda) => {
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
      };
    });
  }
}
