import { FindAllParams } from 'src/gestao-produtividade/dtos/params.dto';
import { Demanda } from '../entities/demanda.entity';
import { Palete } from '../entities/palete.entity';
import { OverViewProdutividadeDataDto } from 'src/gestao-produtividade/dtos/produtividade/produtivididade.overView.dto';
import { DemandaProcesso } from 'src/_shared/enums';

export interface IDemandaProdutividadeRepository {
  findAll(params: FindAllParams): Promise<Demanda[]>;
  findById(idDemanda: string): Promise<Demanda | undefined>;
  findPaletes(paletesId: string[]): Promise<Palete[]>;
  create(demanda: Demanda, paletesIds: string[]): Promise<void>;
  finalizarPalete(paletes: Palete[]): Promise<void>;
  getDemandaByPaleteId(paleteId: string): Promise<Demanda | undefined>;
  finalizarDemandas(demandas: Demanda[]): Promise<void>;
  overViewProdutividade(
    centerId: string,
    processo: DemandaProcesso,
    dataRegistro: string,
  ): Promise<OverViewProdutividadeDataDto>;
  delete(demandaId: number): Promise<void>;
  countPaletesDemanda(id: number): Promise<number>;
}
