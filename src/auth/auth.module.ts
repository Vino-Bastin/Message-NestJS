import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy, RefreshAuthStrategy } from './strategies';

import { User, UserSchema } from 'src/Mongoose/user.schema';

@Module({
  imports: [
    //* importing JWT module
    JwtModule.register({}),
    //* importing mongoose user schema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AuthStrategy, RefreshAuthStrategy],
})
export class AuthModule {}
