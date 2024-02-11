import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { Cookie, Public, Serialize, UserAgent } from '@/decorators';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { UserResponse } from '../user/user.response';

const REFRESH_TOKEN = 'refreshToken';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Serialize()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);

    if (!user) {
      throw new BadRequestException(
        `Something went wrong when trying to register user: ${JSON.stringify(
          dto,
        )}`,
      );
    }

    return new UserResponse(user);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(dto, agent);

    if (!tokens) {
      throw new BadRequestException(
        `Unable to login with: ${JSON.stringify(dto)}`,
      );
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  @Post('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
    }

    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(refreshToken, agent);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);
  }

  // @UseGuards(GoogleGuard)
  // @Get('google')
  // googleAuth() {}
  // @UseGuards(GoogleGuard)
  // @Get('google/callback')
  // googleAuthCallback(@Req() req: Request, @Res() res: Response) {
  //   const token = req.user['accessToken'];
  //   return res.redirect(
  //     `http://localhost:3000/api/auth/success-google?token=${token}`,
  //   );
  // }

  // @Get('success-google')
  // successGoogle(
  //   @Query('token') token: string,
  //   @UserAgent() agent: string,
  //   @Res() res: Response,
  // ) {
  //   return this.httpService
  //     .get(
  //       `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
  //     )
  //     .pipe(
  //       mergeMap(({ data: { email } }) =>
  //         this.authService.providerAuth(email, agent, Provider.GOOGLE),
  //       ),
  //       map((data) => this.setRefreshTokenToCookies(data, res)),
  //       handleTimeoutAndErrors(),
  //     );
  // }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
