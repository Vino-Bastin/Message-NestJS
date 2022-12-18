import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from 'src/user/userDto/user.dto';

//* auth service
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //* signup route - /auth/signup
  @Post('signup')
  signUp(@Body() newUser: NewUserDto) {
    return this.authService.createNewUser(newUser);
  }
}
