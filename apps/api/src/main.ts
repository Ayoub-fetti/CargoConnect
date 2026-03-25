import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: false,
  });
  app.setGlobalPrefix('api');

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.use(
    '/api/subscriptions/webhook',
    express.raw({ type: 'application/json' }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
