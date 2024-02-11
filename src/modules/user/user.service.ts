import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(user: { email: string; password: string } & Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);

    const createdUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        // provider: user.provider,
        roles: ['USER'],
        nickname: user.nickname,
      },
    });

    return createdUser;
  }

  async update(id: string, user: Partial<User>) {
    const hashedPassword = this.hashPassword(user?.password);

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    return updatedUser;
  }

  async findOne(where: { id?: string; email?: string; nickname?: string }) {
    const user = await this.prismaService.user.findFirst({
      where: {
        ...where,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async delete(id: string) {
    return this.prismaService.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  private hashPassword(password: string | undefined): string | undefined {
    if (!password) {
      return undefined;
    }

    return hashSync(password, genSaltSync());
  }
}
