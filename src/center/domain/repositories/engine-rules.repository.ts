import { EngineRuleCreateDto } from 'src/center/dto/engine-rules/enginerule.create.dto';
import { EngineRuleGetData } from 'src/center/dto/engine-rules/enginerule.get.dto';
import { EngineRuleUpdateData } from 'src/center/dto/engine-rules/enginerule.update.dto';

export interface IEngineRulesRepository {
  create(engineRuleDto: EngineRuleCreateDto, accountId: string): Promise<void>;
  findAll(centerId: string): Promise<EngineRuleGetData[]>;
  findOne(id: string): Promise<EngineRuleGetData | undefined>;
  update(id: string, engineRuleDto: EngineRuleUpdateData): Promise<void>;
  delete(id: string): Promise<void>;
}
