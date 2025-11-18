import { createUpdateSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { rulesEngines } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const updateEngineRuleSchema = createUpdateSchema(rulesEngines);

export type EngineRuleUpdateData = z.infer<typeof updateEngineRuleSchema>;

export class EngineRuleUpdateDto extends createZodDto(updateEngineRuleSchema) {}
