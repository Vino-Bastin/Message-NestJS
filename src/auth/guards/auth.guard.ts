import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGY, PUBLIC_ROUTE } from 'src/Common/Constants';

//* Guard to Protect Routes and allows user to access route and resources if user having valid JWT
@Injectable()
export class JwtAuthGuard
  extends AuthGuard(JWT_STRATEGY)
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  //* method to check whether the router is marked as public or not
  //* if not public execute jwt guard from passport-jwt , if public don't execute
  canActivate(context: ExecutionContext) {
    //* get value from custom decorator Public to check to route was marked as public
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_ROUTE,
      context.getHandler(),
    );

    if (isPublic) return true;

    return super.canActivate(context);
  }
}
