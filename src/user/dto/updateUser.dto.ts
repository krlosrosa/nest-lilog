import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { DemandaTurno } from 'src/_shared/enums';

export const editUserSchema = z.object({
  name: z.string(),
  turno: z.nativeEnum(DemandaTurno),
});

export class EditUserDto extends createZodDto(editUserSchema) {}
