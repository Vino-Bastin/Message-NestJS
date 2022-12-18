import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from 'src/user/userDto/user.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() newUser: NewUserDto): Promise<User> {
    return this.authService.createNewUser(newUser);
  }
}
