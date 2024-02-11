import { User } from '@prisma/client';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';

import { IsPasswordsMatchingConstraint } from '@/decorators';

export class UpdateDto implements Partial<User> {
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  passwordConfirmation?: string;

  nickname?: string;
}
