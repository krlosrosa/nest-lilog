import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  composite: z.boolean(),
  clientRole: z.boolean(),
  containerId: z.string(),
});

export class RoleDto extends createZodDto(roleSchema) {}
