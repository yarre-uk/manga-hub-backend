import { Controller, Delete, Get, Patch } from '@nestjs/common';

import { CurrentUser } from '@/decorators';

import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  me(@CurrentUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  update(@CurrentUser('id') userId: string) {
    return this.profileService.updateProfile(userId);
  }

  @Delete()
  delete(@CurrentUser('id') userId: string) {
    return this.profileService.deleteProfile(userId);
  }
}
