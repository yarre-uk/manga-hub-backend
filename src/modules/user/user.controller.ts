import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Role } from '@prisma/client';

import { Serialize, CurrentUser, Auth } from '@/decorators';

import { UserResponse } from './user.response';
import { UserService } from './user.service';
import { JwtPayload } from '../auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(Role.ADMIN)
  @Serialize()
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Auth(Role.ADMIN)
  @Serialize()
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.userService.delete(id, user);
  }
}
