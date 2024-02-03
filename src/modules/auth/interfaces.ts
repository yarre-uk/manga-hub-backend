import { Token } from '@prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: Token;
};

export type JwtPayload = {
  id: string;
  email: string;
  roles: string[];
};
