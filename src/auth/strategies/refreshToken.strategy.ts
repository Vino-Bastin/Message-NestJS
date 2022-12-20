import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { REFRESH_JWT_STRATEGY } from 'src/Common/Constants';
import { JwtPayloadDto } from 'src/DTO/user.dto';
import { User, UserDocument } from 'src/Mongoose/user.schema';

//* jwt refresh token authentication strategy - to check wether user having valid refresh token or not
@Injectable()
export class RefreshAuthStrategy extends PassportStrategy(
  Strategy,
  REFRESH_JWT_STRATEGY,
) {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_KEY'),
      passReqToCallback: true,
    });
  }

  //* once validation done setting up jwt payload to request.user
  async validate(req: Request, payload: JwtPayloadDto): Promise<object> {
    const user = await this.userModel
      .findById(payload.sub)
      .select('+refreshToken');

    const token = req.get('authorization').split(' ')[1];

    //* check if refresh token and refresh token in db are same if not throw an error
    if (token !== user.refreshToken)
      throw new ForbiddenException({ message: 'Refresh token malformed' });

    return { sub: payload.sub, userName: payload.userName };
  }
}
