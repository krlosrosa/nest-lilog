import { Inject, Injectable } from '@nestjs/common';
import { type IEngineRulesRepository } from './domain/repositories/engine-rules.repository';
import { EngineRuleCreateDto } from './dto/engine-rules/enginerule.create.dto';
import { EngineRuleGetData } from './dto/engine-rules/enginerule.get.dto';
import { EngineRuleUpdateData } from './dto/engine-rules/enginerule.update.dto';

@Injectable()
export class EngineRulesService {
  constructor(
    @Inject('IEngineRulesRepository')
    private readonly engineRulesRepo: IEngineRulesRepository,
  ) {}
  create(engineRuleDto: EngineRuleCreateDto, accountId: string): Promise<void> {
    return this.engineRulesRepo.create(engineRuleDto, accountId);
  }

  findAll(centerId: string): Promise<EngineRuleGetData[]> {
    return this.engineRulesRepo.findAll(centerId);
  }

  update(id: string, engineRuleDto: EngineRuleUpdateData): Promise<void> {
    return this.engineRulesRepo.update(id, engineRuleDto);
  }

  delete(id: string): Promise<void> {
    return this.engineRulesRepo.delete(id);
  }
}
