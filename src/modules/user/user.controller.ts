import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { CurrentUser, Roles } from '@/decorators';

import { UserResponse } from './user.response';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtPayload } from '../auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.userService.delete(id, user);
  }
}
