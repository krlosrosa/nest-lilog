import { Module } from '@nestjs/common';
import { GestaoProdutividadeService } from './gestao-produtividade.service';
import { GestaoProdutividadeController } from './gestao-produtividade.controller';
import { CriarDemandaProdutividade } from './aplication/criarDemanda.usecase';
import { ProdutividadeRepositoryDrizzle } from './infra/repository.demanda';
import { FinalizarPaleteProdutividade } from './aplication/finalizarPalete.usecase';
import { AddPausaIndividual } from './aplication/addPausaIndividual.usecase';
import { PausaRepositoryDrizzle } from './infra/repository.pausa';
import { FinalizarPausaIndividual } from './aplication/finalizarPausaIndividual.usecase';
import { AddPausaGeral } from './aplication/addPausaGeral.usecase';
import { BuscarPausasAtivas } from './aplication/buscarPausasAtivas';
import { FinalizarPausaGeral } from './aplication/finalizarPausaGeral.usecase';
import { AtualizarDemandaProdutividade } from './aplication/atualizarDemanda.usecase';
import { ProdutividadeListener } from './events/listeners/produtividade.listener';
import { GetProdutividadeUsecase } from './aplication/get-produtividade.usecase';
import { OverViewProdutividade } from './aplication/overViewProdutividade.usecase';
import { GetProdutividadeByIdUsecase } from './aplication/get-produtividadeById.usecase';
import { DeletarDemandaUsecase } from './aplication/deletarDemanda.usecase';

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
    {
      provide: 'IDemandaProdutividadeRepository',
      useClass: ProdutividadeRepositoryDrizzle,
    },
    {
      provide: 'IPausaRepository',
      useClass: PausaRepositoryDrizzle,
    },
  ],
})
export class GestaoProdutividadeModule {}
