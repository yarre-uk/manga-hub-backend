import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  getProfile(profileId: string) {
    return this.userService.findOne({ id: profileId });
  }

  updateProfile(profileId: string, profileUpdateData: Partial<User>) {
    return this.userService.update(profileId, profileUpdateData);
  }

  deleteProfile(profileId: string) {
    return this.userService.delete(profileId);
  }
}
