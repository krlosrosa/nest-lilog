import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { IEngineRulesRepository } from 'src/center/domain/repositories/engine-rules.repository';
import { EngineRuleCreateDto } from 'src/center/dto/engine-rules/enginerule.create.dto';
import { EngineRuleUpdateData } from 'src/center/dto/engine-rules/enginerule.update.dto';
import { EngineRuleGetData } from 'src/center/dto/engine-rules/enginerule.get.dto';
import { and, eq } from 'drizzle-orm';
import { Json } from 'drizzle-zod';
import { rulesEngines } from 'src/_shared/infra/drizzle';

export class EngineRulesRepositoryDrizzle implements IEngineRulesRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    engineRuleDto: EngineRuleCreateDto,
    accountId: string,
  ): Promise<void> {
    await this.db
      .insert(rulesEngines)
      .values({
        ...engineRuleDto,
        criadoPorId: accountId,
        updatedAt: new Date().toISOString(),
      })
      .returning();
  }

  async findAll(centerId: string): Promise<EngineRuleGetData[]> {
    const resultados = await this.db
      .select()
      .from(rulesEngines)
      .where(and(eq(rulesEngines.centerId, centerId)));
    return resultados.map((resultado) => ({
      ...resultado,
      conditions: resultado.conditions as Json,
    }));
  }

  findOne(id: string): Promise<EngineRuleGetData | undefined> {
    return Promise.resolve(undefined);
  }

  async update(id: string, engineRuleDto: EngineRuleUpdateData): Promise<void> {
    await this.db
      .update(rulesEngines)
      .set(engineRuleDto)
      .where(eq(rulesEngines.id, Number(id)));
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(rulesEngines).where(eq(rulesEngines.id, Number(id)));
    return Promise.resolve();
  }
}
