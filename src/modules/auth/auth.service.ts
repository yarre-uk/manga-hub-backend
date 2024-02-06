import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { add } from 'date-fns';
import { v4 } from 'uuid';

import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (user) {
      throw new ConflictException(`User ${user.email} already registered`);
    }

    return this.userService.create(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    //TODO
    if (user && !user.password) {
      throw new UnauthorizedException(
        'Account was registered with auth provider',
      );
    }

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Wrong login or password');
    }

    return this.generateTokens(user, agent);
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.delete({
      where: { token: refreshToken },
    });
    if (!token || new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(token.userId);
    return this.generateTokens(user, agent);
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({ where: { token } });
  }

  //TODO
  // async providerAuth(email: string, agent: string, provider: Provider) {
  //   const userExists = await this.userService.findOne(email);

  //   if (userExists) {
  //     const user = await this.userService
  //       .update( ,{ email, provider })
  //       .catch((err) => {
  //         this.logger.error(err);
  //         return null;
  //       });
  //     return this.generateTokens(user, agent);
  //   }

  //   const user = await this.userService
  //     .save({ email, provider })
  //     .catch((err) => {
  //       this.logger.error(err);
  //       return null;
  //     });

  //   if (!user) {
  //     throw new HttpException(
  //       `Unable to create user with email ${email} with ${provider} auth`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return this.generateTokens(user, agent);
  // }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    const refreshToken = await this.getRefreshToken(user.id, agent);

    return { accessToken: `Bearer ${accessToken}`, refreshToken };
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: { userId, userAgent: agent },
    });

    const token = _token?.token ?? '';

    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }
}
