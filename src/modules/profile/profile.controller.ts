import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '@/decorators';

import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  me(@CurrentUser('id') userId: string) {
    return userId;
  }
}
