import { Module } from '@nestjs/common';
import { AnomaliasProdutividadeService } from './anomalias-produtividade.service';
import { AnomaliasProdutividadeController } from './anomalias-produtividade.controller';
import { AnomaliaListener } from './events/anomalia.listener';
import { EngineRulesRepositoryDrizzle } from 'src/center/infra/drizzle/repository-engine-rules';
import { AnomaliaProdutividadeRepositoryDrizzle } from './infra/repository';

@Module({
  controllers: [AnomaliasProdutividadeController],
  providers: [
    AnomaliasProdutividadeService,
    AnomaliaListener,
    {
      provide: 'IEngineRulesRepository',
      useClass: EngineRulesRepositoryDrizzle,
    },
    {
      provide: 'IRegistroAnomaliaProdutividadeRepository',
      useClass: AnomaliaProdutividadeRepositoryDrizzle,
    },
  ],
})
export class AnomaliasProdutividadeModule {}
