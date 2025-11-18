import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserRole } from 'src/_shared/enums/funcionario-role.enum';

export const queriesSchema = z.object({
  role: z.nativeEnum(UserRole).optional().nullable(),
  processo: z.string().optional().nullable(),
  search: z.string().optional().nullable(),
});

export class QueriesDtoUserCenter extends createZodDto(queriesSchema) {}
