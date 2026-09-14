import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Headers de seguridad estándar (HSTS, X-Content-Type-Options,
  // X-Frame-Options, etc.) — no se reinventan, se delega en helmet.
  app.use(helmet());

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

  // docs/api/ se genera automáticamente desde aquí — fuente de verdad del contrato.
  // Solo se expone fuera de producción: en prod es superficie de
  // información (rutas, DTOs, shape exacto de la API) sin valor para
  // el usuario final y sí para un atacante reconociendo el sistema.
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('WithNothin API')
      .setDescription('Contrato REST consumido por apps/web y apps/mobile')
      .setVersion('0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`WithNothin API escuchando en http://localhost:${port}/api/v1`);
}

bootstrap();
