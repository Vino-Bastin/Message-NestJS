import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  JwtPayloadDto,
  LoginCredentialsDto,
  NewUserDto,
} from 'src/DTO/user.dto';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  //* create a new user function
  async signUp(user: NewUserDto): Promise<unknown> {
    const newUser = await this.userService.create(user);

    const userDetails = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userName: newUser.userName,
    };

    const payload = {
      sub: newUser._id,
      userName: user.firstName,
    };

    return this.JwtWithUserDetails(userDetails, payload);
  }

  //* login route handler function
  async login(loginCredentials: LoginCredentialsDto) {
    const user = await this.userService.fineOneByUserName(
      loginCredentials.userName,
      '+password',
    );

    if (!user)
      throw new BadRequestException({
        message: 'No User Found with given User Name',
      });

    const isValid = await this.userService.verifyPassword(
      loginCredentials.password,
      user.password,
    );

    if (!isValid)
      throw new BadRequestException({
        message: 'Password was wrong - Please Provide correct one',
      });

    const userDetails = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    };

    const payload = {
      sub: user._id,
      userName: user.userName,
    };

    return this.JwtWithUserDetails(userDetails, payload);
  }

  //* logout route handler function
  async logout(userId: Types.ObjectId) {
    //* removing refresh token from db
    await this.userService.findByIdAndUpdate(userId, { refreshToken: '' });

    return { status: 'success' };
  }

  //* refresh auth token route handler function
  async refresh(jwtPayload: JwtPayloadDto) {
    const authToken = await this.generateAuthToken(jwtPayload);

    const user = await this.userService.findById(
      jwtPayload.sub,
      '+refreshToken',
    );

    return {
      status: 'success',
      authToken,
      refreshToken: user.refreshToken,
      userDetails: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    };
  }

  //* ------------------ helper functions ------------------
  //* generate response data with jwt tokens with userDetails
  private async JwtWithUserDetails(
    userDetails: any,
    payload: JwtPayloadDto,
  ): Promise<object> {
    const [authToken, refreshToken] = await Promise.all([
      this.generateAuthToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.userService.findByIdAndUpdate(payload.sub, {
      refreshToken: refreshToken,
    });

    return {
      status: 'success',
      authToken,
      refreshToken,
      userDetails,
    };
  }

  //* generate jwt token
  private async generateAuthToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
      expiresIn: 60 * 15,
    });
  }

  //* generate refresh token
  private async generateRefreshToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_KEY'),
      expiresIn: 60 * 60 * 24 * 7,
    });
  }
}
