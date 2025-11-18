import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const arrayResultadoHoraHoraSchema = z.object({
  hora: z.number(),
  totalCarregados: z.number(),
});

const resultadoHoraHoraSchema = z.object({
  totalTransportes: z.number(),
  horaHora: z.array(arrayResultadoHoraHoraSchema),
});

export type ResultadoHoraHora = z.infer<typeof arrayResultadoHoraHoraSchema>;

export class ResultadoHoraHoraDto extends createZodDto(
  resultadoHoraHoraSchema,
) {}
