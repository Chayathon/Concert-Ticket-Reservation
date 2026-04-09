import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { type AccessTokenPayload } from './auth.constants';

const JWT_SECRET = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: loginDto.userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return {
      accessToken: this.generateAccessToken(user.id, user.role),
      user,
    };
  }

  async me(accessToken: string) {
    const payload = this.verifyAccessToken(accessToken);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }

  private generateAccessToken(userId: number, role: 'USER' | 'ADMIN'): string {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return sign({ userId, role }, JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  private verifyAccessToken(accessToken: string): AccessTokenPayload {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    let payload: unknown;
    try {
      payload = verify(accessToken, JWT_SECRET);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    return {
      userId: (payload as { userId: number }).userId,
      role: (payload as { role: 'USER' | 'ADMIN' }).role,
    };
  }
}
