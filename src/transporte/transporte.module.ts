import { Module } from '@nestjs/common';
import { TransporteService } from './transporte.service';
import { TransporteController } from './transporte.controller';
import { AtualizarStatusTransportes } from './application/atualizarStatusTransportes.usecase';
import { TransporteRepositoryDrizzle } from './infra/repository';
import { TransporteListener } from './events/listeners/transporte.listener';
import { AdicionarHistorioTransporte } from './application/adicionarHistorioTransporte.ts.usecase';
import { CargaParadaRepositoryDrizzle } from './infra/cargaParada.repository';
import { UpdateTransporteSeparacao } from './application/updateTransporte/separacao';
import { UpdateTransporteCarregamento } from './application/updateTransporte/carregamento';
import { UpdateTransporteConferencia } from './application/updateTransporte/conferencia';
import { AtualizarStatusTransportesByPalete } from './application/atualizarStatusTransportesByPalete.usecase';

@Module({
  controllers: [TransporteController],
  providers: [
    TransporteService,
    AtualizarStatusTransportes,
    TransporteListener,
    AdicionarHistorioTransporte,
    UpdateTransporteCarregamento,
    UpdateTransporteConferencia,
    UpdateTransporteSeparacao,
    AtualizarStatusTransportesByPalete,
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
