import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  type AccessTokenPayload,
} from '../auth.constants';

type RequestWithCookiesAndUser = {
  cookies?: Record<string, string>;
  user?: AccessTokenPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithCookiesAndUser>();
    const token = request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    let payload: unknown;
    try {
      payload = verify(token, jwtSecret);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    request.user = {
      userId: (payload as { userId: number }).userId,
      role: (payload as { role: AccessTokenPayload['role'] }).role,
    };

    return true;
  }
}
