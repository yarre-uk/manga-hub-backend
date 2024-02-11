import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { User } from '@prisma/client';

import { CurrentUser, Serialize } from '@/decorators';

import { ProfileService } from './profile.service';
import { UserResponse } from '../user/user.response';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Serialize()
  async getProfile(@CurrentUser('id') userId: string) {
    console.log('userId ->', userId);
    return new UserResponse(await this.profileService.getProfile(userId));
  }

  @Patch()
  @Serialize()
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() newProfileData: Partial<User>,
  ) {
    return new UserResponse(
      await this.profileService.updateProfile(userId, newProfileData),
    );
  }

  @Delete()
  deleteProfile(@CurrentUser('id') userId: string) {
    return this.profileService.deleteProfile(userId);
  }
}
