import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards';

@Module({
  imports: [
    //* setup env variables at globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //* database connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      //* using factory function to get database url from .env file
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
    }),
    AuthModule,
  ],
  providers: [
    //* global app guard for jwt verification
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
