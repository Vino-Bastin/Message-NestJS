import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

import { AppExceptionsFilter } from './Errors/app.exceptions';

async function bootstrap() {
  //* creating nestJs app
  const app = await NestFactory.create(AppModule);

  //* global Error Handler class instance
  app.useGlobalFilters(new AppExceptionsFilter());

  //* global validation pipeline
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  //* morgan middleware to log request
  app.use(morgan('tiny'));

  //* starting the application
  const PORT = app.get(ConfigService).get<string>('PORT') || 7000;
  await app.listen(PORT, () => {
    console.log(`App was listening on PORT : ${PORT}`);
  });
}
bootstrap();
