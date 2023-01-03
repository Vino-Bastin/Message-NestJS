import { MinLength, IsNotEmpty, IsString } from 'class-validator';
import { IsEqualTo } from 'src/Common/Validation';
import { Types } from 'mongoose';

//* signup new user required fields class-validator
export class NewUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEqualTo('password', {
    message: 'Password and confirmPassword must be same',
  })
  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

//* login/signIn required input fields class-validator
export class LoginCredentialsDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  password: string;
}

//* jwt payload DTO class
export class JwtPayloadDto {
  sub: Types.ObjectId;
  userName: string;
}

export interface LoginResponse {
  refreshToken: string;
  authToken: string;
  status: string;
  userDetails: {
    id: Types.ObjectId;
    userName: string;
    firstName: string;
    lastName: string;
  };
}
