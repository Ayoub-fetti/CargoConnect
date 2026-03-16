import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true, bodyParser: false });
  app.setGlobalPrefix('api');

  // raw body for stripe webhook
  app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

  // json body for everything else
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
