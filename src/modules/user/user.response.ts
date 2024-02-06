import { $Enums, Provider, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;
  nickname: string;

  @Exclude()
  password: string;
  @Exclude()
  provider: Provider;

  roles: $Enums.Role[];
  createdAt: Date;
  updatedAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
