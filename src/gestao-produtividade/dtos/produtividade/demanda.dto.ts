import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { DemandaProcesso, DemandaStatus } from 'src/_shared/enums';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';

const paleteSchema = z.object({
  id: z.string(),
  empresa: z.string(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  quantidadePaletes: z.number(),
  enderecoVisitado: z.number(),
  transporteId: z.string(),
  tipoProcesso: z.nativeEnum(DemandaProcesso),
  status: z.nativeEnum(StatusPalete),
});

const DemandaSchema = z.object({
  idDemanda: z.number(),
  processo: z.nativeEnum(DemandaProcesso),
  status: z.nativeEnum(DemandaStatus),
  funcionarioId: z.string(),
  centerId: z.string(),
  dataExpedicao: z.string(),
  paletes: z.array(paleteSchema),
});

export class DemandaDto extends createZodDto(DemandaSchema) {}
