import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { CommentModule } from './comment/comment.module';

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
    UserModule,
    MessageModule,
    CommentModule,
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
