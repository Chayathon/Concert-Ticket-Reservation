import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type AccessTokenPayload } from '../auth.constants';

type RequestWithUser = {
  user?: AccessTokenPayload;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    return request.user as AccessTokenPayload;
  },
);
