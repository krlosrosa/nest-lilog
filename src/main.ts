import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './_shared/config/swagger.config';
import { validationSchema } from './_shared/config/validation.schema';
import './instrument';
import * as express from 'express';

async function bootstrap() {
  try {
    validationSchema.parse(process.env);
    console.log('✅ Variáveis de ambiente validadas com sucesso com Zod.');
  } catch (error) {
    // 3. Se houver erro, capture, formate e pare a aplicação
    throw new Error(
      `!!!! Erro de validação de variáveis de ambiente !!!! \n ${error}`,
    );
  }
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // Aumenta o limite do body parser para 50MB (padrão é 100KB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*', // permite todas as origens (pode substituir pelo domínio específico)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.setGlobalPrefix('api');
  setupSwagger(app); // 2. Chame a função para configurar o Swagger
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
