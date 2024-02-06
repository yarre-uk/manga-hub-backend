import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  getProfile(profileId: string) {
    return this.userService.findOne(profileId);
  }

  updateProfile(profileId: string) {
    console.log('profileId', profileId);
  }

  deleteProfile(profileId: string) {
    return this.userService.delete(profileId);
  }
}
