import { createSelectSchema } from 'drizzle-zod';
import { transporte } from 'src/_shared/infra/drizzle/migrations/schema';
import { getCorteMercadoriaSchema } from 'src/corte-produto/dto/corte.get.dto';
import { getPaleteSchema } from 'src/gestao-produtividade/dtos/palete/palete.get.dto';
import z from 'zod';
import { getHistoricoTransporteSchema } from './historicoTransporte/historicoTransporte.get.dto';
import { getImpressaoMapaSchema } from './impressaoMapa/impressaoMapa.get.dto';
import { createZodDto } from 'nestjs-zod';
import { listarClientesSchema } from './listarClientes.dto';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getTransporteSchema = createSelectSchema(transporte);

export class GetTransporteDto extends createZodDto(getTransporteSchema) {}

export const getTransporteSchemaComPaletes = getTransporteSchema.extend({
  paletes: z.array(getPaleteSchema).optional().default([]), // A relação!
});

export type TransporteGetData = z.infer<typeof getTransporteSchemaComPaletes>;

export const getTransporteComRelacionamentosSchema = getTransporteSchema.extend(
  {
    paletes: z.array(getPaleteSchema).optional().default([]), // A relação!
    cortes: z.array(getCorteMercadoriaSchema).optional().default([]),
    historicoTransporte: z
      .array(getHistoricoTransporteSchema)
      .optional()
      .default([]),
    impressaoMapa: z.array(getImpressaoMapaSchema).optional().default([]),
    clientes: z.array(listarClientesSchema).optional().default([]),
  },
);

export class TransporteComRelacionamentosGetDto extends createZodDto(
  getTransporteComRelacionamentosSchema,
) {}
