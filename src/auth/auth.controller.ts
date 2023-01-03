import {
  Controller,
  Body,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, LoginCredentialsDto } from 'src/DTO/user.dto';
import { Public } from 'src/Common/decorator';
import { RefreshJwtAuthGuard } from './guards';
import { Response } from 'express';

//* auth module controller and routes
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //* signup route - /auth/signup
  @Public() //* marking route as public route
  @Post('signup')
  @HttpCode(HttpStatus.CREATED) //* setting up http status code
  async signUp(@Body() newUser: NewUserDto, @Res() res: Response) {
    const response = await this.authService.signUp(newUser);
    res.cookie('refreshToken', response.refreshToken, {
      // secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      // sameSite: 'none',
    });
    res.json(response);
  }

  //* login route - /auth/login
  @Public() //* marking route as public route
  @Post('login')
  @HttpCode(HttpStatus.OK) //* setting up http status code
  async login(
    @Body() loginCredentials: LoginCredentialsDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.login(loginCredentials);
    res.cookie('refreshToken', response.refreshToken, {
      // secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      // sameSite: 'none',
    });
    res.json(response);
  }

  //* logout route - /auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@Request() req) {
    return this.authService.logout(req.user.sub);
  }

  //* refresh token route - /auth/refresh
  @UseGuards(RefreshJwtAuthGuard) //* check whether user having valid refresh token or not
  @Public() //* marking route as public route to avoid auth jwt validation
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
