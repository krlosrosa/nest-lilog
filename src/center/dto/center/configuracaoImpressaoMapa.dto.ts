import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { configuracaoImpressaoMapa } from 'src/_shared/infra/drizzle/migrations/schema';

export const configuracaoImpressaoMapaSchema = createSelectSchema(
  configuracaoImpressaoMapa,
);

export class ConfiguracaoImpressaoMapaDto extends createZodDto(
  configuracaoImpressaoMapaSchema,
) {}
