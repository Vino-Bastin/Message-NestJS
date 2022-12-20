import { AuthGuard } from '@nestjs/passport';
import { REFRESH_JWT_STRATEGY } from 'src/Common/Constants';

//* Guard to protect refresh token route
export class RefreshJwtAuthGuard extends AuthGuard(REFRESH_JWT_STRATEGY) {
  constructor() {
    super();
  }
}
