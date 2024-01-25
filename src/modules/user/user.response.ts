import { $Enums, Provider, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;

  @Exclude()
  password: string;
  @Exclude()
  provider: Provider;
  @Exclude()
  createdAt: Date;

  roles: $Enums.Role[];
  updatedAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
