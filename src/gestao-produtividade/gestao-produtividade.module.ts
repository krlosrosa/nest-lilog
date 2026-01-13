import { Module } from '@nestjs/common';
import { GestaoProdutividadeService } from './gestao-produtividade.service';
import { GestaoProdutividadeController } from './gestao-produtividade.controller';
import { CriarDemandaProdutividade } from './aplication/demanda/criarDemanda.usecase';
import { ProdutividadeRepositoryDrizzle } from './infra/repository.demanda';
import { FinalizarPaleteProdutividade } from './aplication/demanda/finalizarPalete.usecase';
import { AddPausaIndividual } from './aplication/pausa/addPausaIndividual.usecase';
import { PausaRepositoryDrizzle } from './infra/repository.pausa';
import { FinalizarPausaIndividual } from './aplication/pausa/finalizarPausaIndividual.usecase';
import { AddPausaGeral } from './aplication/pausa/addPausaGeral.usecase';
import { BuscarPausasAtivas } from './aplication/pausa/buscarPausasAtivas';
import { FinalizarPausaGeral } from './aplication/pausa/finalizarPausaGeral.usecase';
import { AtualizarDemandaProdutividade } from './aplication/demanda/atualizarDemanda.usecase';
import { ProdutividadeListener } from './events/listeners/produtividade.listener';
import { GetProdutividadeUsecase } from './aplication/get-produtividade.usecase';
import { OverViewProdutividade } from './aplication/overViewProdutividade.usecase';
import { GetProdutividadeByIdUsecase } from './aplication/get-produtividadeById.usecase';
import { DeletarDemandaUsecase } from './aplication/demanda/deletarDemanda.usecase';
import GetDemandaUsecase from './aplication/demanda/getDemanda.usecase';
import { DeletarDemandaAnomaliaUsecase } from './aplication/demanda/deletarDemandaAnomalia.usecase';
import { FinalizarPaleteUpdateDemanda } from './aplication/demanda/finalizarPaleteUpdateDemanda.usecase';
import { TransporteRepositoryDrizzle } from 'src/transporte/infra/repository';

@Module({
  controllers: [GestaoProdutividadeController],
  providers: [
    GestaoProdutividadeService,
    CriarDemandaProdutividade,
    FinalizarPaleteProdutividade,
    AddPausaIndividual,
    FinalizarPausaIndividual,
    AddPausaGeral,
    BuscarPausasAtivas,
    FinalizarPausaGeral,
    AtualizarDemandaProdutividade,
    ProdutividadeListener,
    GetProdutividadeUsecase,
    OverViewProdutividade,
    GetProdutividadeByIdUsecase,
    DeletarDemandaUsecase,
    GetDemandaUsecase,
    DeletarDemandaAnomaliaUsecase,
    FinalizarPaleteUpdateDemanda,
    {
      provide: 'IDemandaProdutividadeRepository',
      useClass: ProdutividadeRepositoryDrizzle,
    },
    {
      provide: 'IPausaRepository',
      useClass: PausaRepositoryDrizzle,
    },
    {
      provide: 'ITransporteRepository',
      useClass: TransporteRepositoryDrizzle,
    },
  ],
})
export class GestaoProdutividadeModule {}
