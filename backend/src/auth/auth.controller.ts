import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  ACCESS_TOKEN_COOKIE_NAME,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    });

    return { user };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() request: Request) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const accessToken = cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      throw new UnauthorizedException('Missing access token');
    }

    const user = await this.authService.me(accessToken);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);

    return { success: true };
  }
}
