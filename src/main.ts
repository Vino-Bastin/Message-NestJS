// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan');

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

import { AppExceptionsFilter } from './errors/app.exceptions';

async function bootstrap() {
  //* creating nestJs app
  const app = await NestFactory.create(AppModule);

  //* global Error Handler class instance
  app.useGlobalFilters(new AppExceptionsFilter());

  //* morgan middleware to log request
  app.use(morgan('tiny'));

  //* starting the application
  const PORT = app.get(ConfigService).get<string>('PORT') || 7000;
  await app.listen(PORT, () => {
    console.log(`App was listening on PORT : ${PORT}`);
  });
}
bootstrap();
