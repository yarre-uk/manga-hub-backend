import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';

import { convertToSecondsUtil } from '@/utils';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async create(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user?.password);

    const createdUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        provider: user.provider,
        roles: ['USER'],
      },
    });

    await this.cacheManager.set(createdUser.id, createdUser);

    return createdUser;
  }

  async update(id: string, user: Partial<User>) {
    const hashedPassword = this.hashPassword(user?.password);

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword ?? undefined,
        provider: user?.provider ?? undefined,
        roles: user?.roles ?? undefined,
      },
    });

    await this.cacheManager.set(updatedUser.id, updatedUser);

    return updatedUser;
  }

  async findOne(id: string) {
    const cachedUser = await this.cacheManager.get<User>(id);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    await this.cacheManager.set(
      id,
      user,
      convertToSecondsUtil(this.configService.get('JWT_EXPIRATION_IN')),
    );

    return user;
  }

  async delete(id: string) {
    await this.cacheManager.del(id);

    return this.prismaService.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  private hashPassword(password: string | undefined): string | null {
    if (!password) {
      return null;
    }

    return hashSync(password, genSaltSync());
  }
}
