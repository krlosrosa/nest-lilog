import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const startDemandaDtoSchema = z.object({
  demandaId: z.number(),
  doca: z.string(),
});

export class StartDemandaDto extends createZodDto(startDemandaDtoSchema) {}
