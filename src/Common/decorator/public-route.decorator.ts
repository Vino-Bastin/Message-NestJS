import { SetMetadata } from '@nestjs/common';

import { PUBLIC_ROUTE } from '../Constants';

//* set route as public
export const Public = () => {
  return SetMetadata(PUBLIC_ROUTE, true);
};
