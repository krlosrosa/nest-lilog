import { Module } from '@nestjs/common';
import { ProdutividadeDashService } from './produtividade-dash.service';
import { ProdutividadeDashController } from './produtividade-dash.controller';
import { DashProdutividadeRepositoryDrizzle } from './infra/repository';
import { ProdutividadeListener } from './events/listeners/dash-produtividade.listener';

@Module({
  controllers: [ProdutividadeDashController],
  providers: [
    ProdutividadeDashService,
    ProdutividadeListener,
    {
      provide: 'IDashProdutividadeRepository',
      useClass: DashProdutividadeRepositoryDrizzle,
    },
  ],
})
export class ProdutividadeDashModule {}
