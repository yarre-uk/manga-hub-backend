import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

import { IsPasswordsMatchingConstraint } from '@/decorators';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  nickname: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  @IsNotEmpty()
  passwordConfirmation: string;
}
