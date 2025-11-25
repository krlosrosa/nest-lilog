import { Module } from '@nestjs/common';
import { TransporteService } from './transporte.service';
import { TransporteController } from './transporte.controller';
import { AtualizarStatusTransportes } from './application/atualizarStatusTransportes.usecase';
import { TransporteRepositoryDrizzle } from './infra/repository';
import { TransporteListener } from './events/listeners/transporte.listener';
import { AdicionarHistorioTransporte } from './application/adicionarHistorioTransporte.ts.usecase';
import { CargaParadaRepositoryDrizzle } from './infra/cargaParada.repository';

@Module({
  controllers: [TransporteController],
  providers: [
    TransporteService,
    AtualizarStatusTransportes,
    TransporteListener,
    AdicionarHistorioTransporte,
    {
      provide: 'ITransporteRepository',
      useClass: TransporteRepositoryDrizzle,
    },
    {
      provide: 'ICargaParadaRepository',
      useClass: CargaParadaRepositoryDrizzle,
    },
  ],
})
export class TransporteModule {}
