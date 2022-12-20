import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtPayloadDto } from 'src/DTO/user.dto';
import { JWT_STRATEGY } from 'src/Common/Constants';
import { User, UserDocument } from 'src/Mongoose/user.schema';

//* Jwt Authentication strategy - to check whether user having valid jwt token or not
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET_KEY'),
    });
  }

  //* once validation done setting up jwt payload to request.user
  async validate(payload: JwtPayloadDto): Promise<object> {
    const user = await this.userModel
      .findById(payload.sub)
      .select('+refreshToken');

    //* check if the user already logged in , if logged in user must have refresh token
    if (!user || !user.refreshToken)
      throw new ForbiddenException({
        message: 'your are not logged in',
      });

    return { sub: payload.sub, userName: payload.userName };
  }
}
