// eslint-disable-next-line @typescript-eslint/no-var-requires
const JWT = require('jsonwebtoken');

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/user/schema/user.schema';
import { UserRepository } from 'src/user/user.repository';
import { NewUserDto } from 'src/user/userDto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
  ) {}

  //* create a new user function
  async createNewUser(user: NewUserDto): Promise<object> {
    //* building a new user object
    const newUserDetails: User = {
      ...user,
      createdAt: new Date(),
      isActive: true,
      passwordChangedAt: new Date(),
    };

    const userData = await this.userRepository.create(newUserDetails);
    const token = await this.generateJWT({ id: userData._id });

    return {
      status: 'success',
      token,
      userDetails: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
      },
    };
  }

  //* generate jwt token
  private async generateJWT(payload: object): Promise<string> {
    return JWT.sign(payload, this.config.get<string>('JWT_SECRET_KEY'), {
      expiresIn: '2 days',
    });
  }
}
