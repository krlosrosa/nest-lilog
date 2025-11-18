import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { DemandaTurno } from 'src/_shared/enums';
import { UserRole } from 'src/_shared/enums/funcionario-role.enum';

export const CriarFuncionarioAdmSchema = z.object({
  centerId: z.string(),
  id: z.string(),
  name: z.string(),
  primeiroNome: z.string().optional(),
  ultimoNome: z.string().optional(),
  credencial: z.string().optional(),
  turno: z.nativeEnum(DemandaTurno),
  processo: z.string().optional(),
  empresa: z.string(),
  role: z.nativeEnum(UserRole).optional(),
  roles: z.array(z.string()).optional().nullable(),
});

export class CreateUserDto extends createZodDto(CriarFuncionarioAdmSchema) {}
