import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const getAllTransportesSchema = z.object({
  transportes: z.array(z.string()),
});

export class GetAllTransportesDto extends createZodDto(
  getAllTransportesSchema,
) {}
