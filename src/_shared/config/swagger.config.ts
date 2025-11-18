// src/config/swagger.config.ts

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Configura a documentação Swagger da aplicação.
 * Acesse a UI do Swagger em /api-docs
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API de Gestão de Devolução e Produtividade')
    .setDescription(
      'Documentação da API responsável por: gestão de produtividade, ' +
        'montagem e impressão de mapas de separação, sistema de devolução de estoque ' +
        'e contagem de inventário.',
    )
    .setVersion('1.0')
    // Tags por módulos para melhor organização
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'docs-json', // <- habilita http://localhost:4000/docs-json
  });
}
