import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { DemandaTurno } from 'src/_shared/enums';

export const listUserSchema = z.object({
  centerId: z.string(),
  id: z.string(),
  name: z.string(),
  turno: z.nativeEnum(DemandaTurno),
  empresa: z.string(),
  roles: z.array(z.string()),
});

export class UserDto extends createZodDto(listUserSchema) {}
