import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const infoMeSchema = z.object({
  id: z.string(),
  name: z.string(),
  empresa: z.enum(['LDB', 'ITB', 'DPA']),
  roles: z.array(z.string()),
});

export class InfoMeDto extends createZodDto(infoMeSchema) {}
