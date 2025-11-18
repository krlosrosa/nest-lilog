import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { rulesEngines } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getEngineRuleSchema = createSelectSchema(rulesEngines);

export type EngineRuleGetData = z.infer<typeof getEngineRuleSchema>;

export class EngineRuleGetDto extends createZodDto(getEngineRuleSchema) {}
