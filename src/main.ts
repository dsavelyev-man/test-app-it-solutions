import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { LOG_LEVELS, ValidationPipe } from '@nestjs/common';
import { PrismaValidatorFilter } from './db/validation/prismaValidator.filter.js';
import { PrismaErrorsFilter } from './db/validation/prismaErrors.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LOG_LEVELS,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new PrismaValidatorFilter(), new PrismaErrorsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
