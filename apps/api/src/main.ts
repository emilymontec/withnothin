import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? [],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // rechaza campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // docs/api/ se genera automáticamente desde aquí — fuente de verdad del contrato
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WithNothin API')
    .setDescription('Contrato REST consumido por apps/web y apps/mobile')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`WithNothin API escuchando en http://localhost:${port}/api/v1`);
}

bootstrap();
