import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const addItemsTransporteSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export class AddItemsTransporteDto extends createZodDto(
  addItemsTransporteSchema,
) {}
