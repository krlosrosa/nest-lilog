import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';
import { CenterRepositoryDrizzle } from './infra/drizzle/repository';
import { EngineRulesController } from './enginerRules.controller';
import { EngineRulesService } from './engineRules.service';
import { EngineRulesRepositoryDrizzle } from './infra/drizzle/repository-engine-rules';

@Module({
  controllers: [CenterController, EngineRulesController],
  providers: [
    CenterService,
    EngineRulesService,
    {
      provide: 'ICenterRepository',
      useClass: CenterRepositoryDrizzle,
    },
    {
      provide: 'IEngineRulesRepository',
      useClass: EngineRulesRepositoryDrizzle,
    },
  ],
})
export class CenterModule {}
