import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { User, UserSchema } from 'src/Mongoose/user.schema';

@Module({
  imports: [
    //* importing mongoose user schema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  //* export userService for other modules
  exports: [UserService],
})
export class UserModule {}
