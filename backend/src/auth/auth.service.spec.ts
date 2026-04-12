import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should return access token and user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Alice',
      role: 'USER',
    });

    jest
      .spyOn(service as never, 'generateAccessToken' as never)
      .mockReturnValue('mock-token');

    const result = await service.login({ userId: 1 });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
    expect(result).toEqual({
      accessToken: 'mock-token',
      user: {
        id: 1,
        name: 'Alice',
        role: 'USER',
      },
    });
  });

  it('login should throw UnauthorizedException when user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.login({ userId: 999 })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('me should return user for valid token', async () => {
    jest
      .spyOn(service as never, 'verifyAccessToken' as never)
      .mockReturnValue({ userId: 2, role: 'ADMIN' });

    prisma.user.findUnique.mockResolvedValue({
      id: 2,
      name: 'Admin',
      role: 'ADMIN',
    });

    const result = await service.me('valid-token');

    expect(result).toEqual({
      id: 2,
      name: 'Admin',
      role: 'ADMIN',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
  });

  it('me should throw UnauthorizedException when token is invalid', async () => {
    jest
      .spyOn(service as never, 'verifyAccessToken' as never)
      .mockImplementation(() => {
        throw new UnauthorizedException('Invalid access token');
      });

    await expect(service.me('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('me should throw UnauthorizedException when user from token does not exist', async () => {
    jest
      .spyOn(service as never, 'verifyAccessToken' as never)
      .mockReturnValue({ userId: 5, role: 'USER' });

    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.me('valid-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
