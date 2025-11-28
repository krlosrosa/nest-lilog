import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { palete } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getPaleteSchema = createSelectSchema(palete).extend({
  dataTransporte: z.string().optional(),
});

// Tipo para dados que JÁ EXISTEM no banco (tem id)
export type PaleteGetData = z.infer<typeof getPaleteSchema>;

export const getPaleteSchemaTransporte = createSelectSchema(palete).extend({
  dataTransporte: z.string().optional(),
});

export type PaleteGetDataTransporte = z.infer<typeof getPaleteSchemaTransporte>;

export const paleteSchema = z.object({
  palete_id: z.string(),
  empresa: z.string(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  quantidadePaletes: z.number(),
  enderecoVisitado: z.number(),
  segmento: z.string(),
  tipoProcesso: z.enum(['SEPARACAO', 'CONFERENCIA', 'CARREGAMENTO']), // ajuste conforme seus valores possíveis
  status_palete: z.string(), // ajuste conforme enum statusPalete
  transporteId: z.string(),
  centerId: z.string(),
  data_expedicao: z.string(), // como vem do SQL ::date, será string tipo 'YYYY-MM-DD'
});

export class PaleteGetDataTransporteDto extends createZodDto(paleteSchema) {}
