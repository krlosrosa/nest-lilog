import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const listarClientesSchema = z.object({
  cliente: z.string(),
  nomeCliente: z.string(),
});

export class ListarClientesDto extends createZodDto(listarClientesSchema) {}
