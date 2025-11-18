import { createZodDto } from 'nestjs-zod';
import {
  DemandaProcesso,
  DemandaStatus,
  DemandaTurno,
} from 'src/_shared/enums';
import { Empresa } from 'src/_shared/enums/empresa.enum';

import { z } from 'zod';

export const findAllParamsSchema = z.object({
  dataRegistro: z.string().optional(),
  demandaIds: z.array(z.number()).optional(),
  funcionarioId: z.string().optional(),
  centerId: z.string().optional(),
  processo: z.nativeEnum(DemandaProcesso).optional(),
  turno: z.nativeEnum(DemandaTurno).optional(),
  status: z.array(z.nativeEnum(DemandaStatus)).optional(),
  paleteIds: z.array(z.string()).optional(),
  segmento: z.string().optional(),
  transporteIds: z.array(z.string()).optional(),
  search: z.string().optional(),
  empresa: z.nativeEnum(Empresa).optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export type FindAllParams = z.infer<typeof findAllParamsSchema>;

export const FindAllParamsDto = createZodDto(findAllParamsSchema);
