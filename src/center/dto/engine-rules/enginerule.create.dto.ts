import { createInsertSchema } from 'drizzle-zod';
import { rulesEngines } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { createZodDto } from 'nestjs-zod'; // 1. Importe a função

// --- 1. Para LER do banco (EXISTENTE) ---
export const createEngineRuleSchema = createInsertSchema(rulesEngines);

export type EngineRuleCreateData = z.infer<typeof createEngineRuleSchema>;

export const createEngineRuleSchemaSelect = createEngineRuleSchema.omit({
  criadoPorId: true,
  id: true,
  updatedAt: true,
  createdBy: true,
  createdAt: true,
});

export class EngineRuleCreateDto extends createZodDto(
  createEngineRuleSchemaSelect,
) {}
