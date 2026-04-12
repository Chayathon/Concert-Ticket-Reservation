import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE_NAME } from './auth.constants';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    login: jest.Mock;
    me: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      me: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should set cookie and return user', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'token-123',
      user: { id: 1, name: 'Alice', role: 'USER' },
    });

    const response = { cookie: jest.fn() } as never;
    const result = await controller.login({ userId: 1 }, response);

    expect(authService.login).toHaveBeenCalledWith({ userId: 1 });
    expect((response as { cookie: jest.Mock }).cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE_NAME,
      'token-123',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
      }),
    );
    expect(result).toEqual({
      user: { id: 1, name: 'Alice', role: 'USER' },
    });
  });

  it('me should return user when access token cookie is provided', async () => {
    authService.me.mockResolvedValue({ id: 2, name: 'Bob', role: 'ADMIN' });

    const request = {
      cookies: {
        [ACCESS_TOKEN_COOKIE_NAME]: 'valid-token',
      },
    } as never;

    const result = await controller.me(request);

    expect(authService.me).toHaveBeenCalledWith('valid-token');
    expect(result).toEqual({
      user: { id: 2, name: 'Bob', role: 'ADMIN' },
    });
  });

  it('me should throw UnauthorizedException when cookie is missing', async () => {
    await expect(controller.me({ cookies: {} } as never)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('logout should clear cookie and return success', () => {
    const response = { clearCookie: jest.fn() } as never;
    const result = controller.logout(response);

    expect(
      (response as { clearCookie: jest.Mock }).clearCookie,
    ).toHaveBeenCalledWith(ACCESS_TOKEN_COOKIE_NAME);
    expect(result).toEqual({ success: true });
  });
});
