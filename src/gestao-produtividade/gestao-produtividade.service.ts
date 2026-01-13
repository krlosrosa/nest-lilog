import { Inject, Injectable } from '@nestjs/common';
import { CriarDemandaProdutividade } from './aplication/demanda/criarDemanda.usecase';
import { DemandaCreateDataComPaletesIds } from './dtos/demanda/demanda.create.dto';
import { FinalizarPaleteProdutividade } from './aplication/demanda/finalizarPalete.usecase';
import { AddPausaIndividual } from './aplication/pausa/addPausaIndividual.usecase';
import { PausaCreateDataDto } from './dtos/pausa/pausa.create.dto';
import { FinalizarPausaIndividual } from './aplication/pausa/finalizarPausaIndividual.usecase';
import { PausaGeralCreateDataDto } from './dtos/pausaGeral/pausaGeral.create.dto';
import { AddPausaGeral } from './aplication/pausa/addPausaGeral.usecase';
import { PausaGeralSearchParamsDto } from './dtos/pausaGeral/pausaGeral.update.dto';
import { BuscarPausasAtivas } from './aplication/pausa/buscarPausasAtivas';
import { FinalizarPausaGeral } from './aplication/pausa/finalizarPausaGeral.usecase';
import { DemandaProcesso, DemandaTurno } from 'src/_shared/enums';
import { FindAllParams } from './dtos/params.dto';
import { GetProdutividadeUsecase } from './aplication/get-produtividade.usecase';
import {
  ProdutividadeGetDataDto,
  ProdutividadeWithPausaAndPaleteDto,
} from './dtos/produtividade/produtividade.model.dto';
import { OverViewProdutividadeDataDto } from './dtos/produtividade/produtivididade.overView.dto';
import { OverViewProdutividade } from './aplication/overViewProdutividade.usecase';
import { GetProdutividadeByIdUsecase } from './aplication/get-produtividadeById.usecase';
import { DeletarDemandaUsecase } from './aplication/demanda/deletarDemanda.usecase';
import GetDemandaUsecase from './aplication/demanda/getDemanda.usecase';
import { DemandaDto } from './dtos/produtividade/demanda.dto';
import { DeletarDemandaAnomaliaUsecase } from './aplication/demanda/deletarDemandaAnomalia.usecase';
import { FinalizarPaleteUpdateDemanda } from './aplication/demanda/finalizarPaleteUpdateDemanda.usecase';

@Injectable()
export class GestaoProdutividadeService {
  constructor(
    @Inject(CriarDemandaProdutividade)
    private readonly criarDemanda: CriarDemandaProdutividade,
    @Inject(FinalizarPaleteProdutividade)
    private readonly finalizarPaleteDemanda: FinalizarPaleteProdutividade,
    @Inject(AddPausaIndividual)
    private readonly addPausaIndividualUsecase: AddPausaIndividual,
    @Inject(FinalizarPausaIndividual)
    private readonly finalizarPausaIndividualUsecase: FinalizarPausaIndividual,
    @Inject(AddPausaGeral)
    private readonly addPausaGeralUsecase: AddPausaGeral,
    @Inject(BuscarPausasAtivas)
    private readonly buscarPausasAtivasUsecase: BuscarPausasAtivas,
    @Inject(FinalizarPausaGeral)
    private readonly finalizarPausaGeralUsecase: FinalizarPausaGeral,
    @Inject(GetProdutividadeUsecase)
    private readonly getProdutividadeUsecase: GetProdutividadeUsecase,
    @Inject(OverViewProdutividade)
    private readonly overViewProdutividadeUsecase: OverViewProdutividade,
    @Inject(GetProdutividadeByIdUsecase)
    private readonly getProdutividadeByIdUsecase: GetProdutividadeByIdUsecase,
    @Inject(DeletarDemandaUsecase)
    private readonly deletarDemandaUsecase: DeletarDemandaUsecase,
    @Inject(GetDemandaUsecase)
    private readonly getDemandaUsecase: GetDemandaUsecase,
    @Inject(DeletarDemandaAnomaliaUsecase)
    private readonly deletarDemandaAnomaliaUsecase: DeletarDemandaAnomaliaUsecase,
    @Inject(FinalizarPaleteUpdateDemanda)
    private readonly finalizarPaleteDemandaTeste: FinalizarPaleteUpdateDemanda,
  ) {}

  create(params: DemandaCreateDataComPaletesIds, cadastradoPorId: string) {
    return this.criarDemanda.execute(params, cadastradoPorId);
  }

  finalizarPalete(paleteIds: string[], atualizadoPor: string) {
    return this.finalizarPaleteDemandaTeste.execute(paleteIds, atualizadoPor);
  }

  addPausaIndividual(
    paleteId: string,
    pausaData: PausaCreateDataDto,
    registradoPorId: string,
  ) {
    return this.addPausaIndividualUsecase.execute(
      paleteId,
      pausaData,
      registradoPorId,
    );
  }

  finalizarPausaIndividual(paleteId: string) {
    return this.finalizarPausaIndividualUsecase.execute(paleteId);
  }

  addPausaGeral(params: PausaGeralCreateDataDto, registradoPorId: string) {
    return this.addPausaGeralUsecase.execute(params, registradoPorId);
  }

  buscarPausasAtivas(centerId: string, params: PausaGeralSearchParamsDto) {
    return this.buscarPausasAtivasUsecase.execute(centerId, params);
  }

  finalizarPausaGeral(
    centerId: string,
    segmento: string,
    turno: DemandaTurno,
    processo: DemandaProcesso,
  ) {
    return this.finalizarPausaGeralUsecase.execute(
      centerId,
      segmento,
      turno,
      processo,
    );
  }

  getProdutividade(
    centerId: string,
    params: FindAllParams,
  ): Promise<ProdutividadeGetDataDto[]> {
    return this.getProdutividadeUsecase.execute(centerId, params);
  }

  overViewProdutividade(
    centerId: string,
    processo: DemandaProcesso,
    dataRegistro: string,
  ): Promise<OverViewProdutividadeDataDto> {
    return this.overViewProdutividadeUsecase.execute(
      centerId,
      processo,
      dataRegistro,
    );
  }

  getProdutividadeById(
    idDemanda: string,
  ): Promise<ProdutividadeWithPausaAndPaleteDto> {
    return this.getProdutividadeByIdUsecase.execute(idDemanda);
  }

  deletarDemandaController(paleteId: string) {
    return this.deletarDemandaUsecase.execute(paleteId);
  }

  getDemandaById(idDemanda: string): Promise<DemandaDto> {
    return this.getDemandaUsecase.execute(idDemanda);
  }

  deletarDemandaAnomalia(idDemanda: string) {
    return this.deletarDemandaAnomaliaUsecase.execute(idDemanda);
  }
}
