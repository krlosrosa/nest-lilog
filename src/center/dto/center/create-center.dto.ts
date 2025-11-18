import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CenterSchema = z.object({
  centerId: z.string().nonempty('centerId é obrigatório'), // obrigatório, não pode ser vazio
  description: z.string().nonempty('description é obrigatório'),
  state: z.string().nonempty('state é obrigatório'),
  cluster: z.string().nonempty('cluster é obrigatório'),
});

export class CenterDto extends createZodDto(CenterSchema) {}
