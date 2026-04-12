import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ACCESS_TOKEN_COOKIE_NAME } from '../auth.constants';
import { verify } from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  function createExecutionContext(request: Record<string, unknown>) {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;
  }

  it('throws UnauthorizedException when token is missing', () => {
    const request = { cookies: {} };

    expect(() => guard.canActivate(createExecutionContext(request))).toThrow(
      new UnauthorizedException('Missing access token'),
    );
  });

  it('throws Error when JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;

    const request = {
      cookies: {
        [ACCESS_TOKEN_COOKIE_NAME]: 'token',
      },
    };

    expect(() => guard.canActivate(createExecutionContext(request))).toThrow(
      new Error('JWT_SECRET is not defined'),
    );
  });

  it('throws UnauthorizedException when token verification fails', () => {
    (verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    const request = {
      cookies: {
        [ACCESS_TOKEN_COOKIE_NAME]: 'invalid-token',
      },
    };

    expect(() => guard.canActivate(createExecutionContext(request))).toThrow(
      new UnauthorizedException('Invalid access token'),
    );
  });

  it('attaches user payload and returns true for valid token', () => {
    (verify as jest.Mock).mockReturnValue({
      userId: 101,
      role: 'ADMIN',
    });

    const request: { cookies: Record<string, string>; user?: unknown } = {
      cookies: {
        [ACCESS_TOKEN_COOKIE_NAME]: 'valid-token',
      },
    };

    const result = guard.canActivate(createExecutionContext(request));

    expect(result).toBe(true);
    expect(request.user).toEqual({
      userId: 101,
      role: 'ADMIN',
    });
  });
});
