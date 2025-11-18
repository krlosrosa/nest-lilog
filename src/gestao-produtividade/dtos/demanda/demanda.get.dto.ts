import { createSelectSchema } from 'drizzle-zod';
import { demanda } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';
import { getPausaSchema } from '../pausa/pausa.get.dto';
import { getPaleteSchema } from '../palete/palete.get.dto';
import { getUserSchema } from 'src/user/dto/user.get.dto';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getDemandaSchema = createSelectSchema(demanda);

// Tipo para dados que JÁ EXISTEM no banco (tem id)

export const getDemandaSchemaComPausas = getDemandaSchema.extend({
  pausas: z.array(getPausaSchema).optional().default([]), // A relação!
  paletes: z.array(getPaleteSchema).optional().default([]), // A relação!
  funcionario: getUserSchema
    .omit({ password: true, token: true, resetSenha: true })
    .optional()
    .nullable(),
});

export type DemandaGetData = z.infer<typeof getDemandaSchemaComPausas>;
