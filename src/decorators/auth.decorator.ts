import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '@prisma/client';

import { RolesGuard } from '@/modules/auth/guards/role.guard';

export const ROLES_METADATA_KEY = 'roles';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_METADATA_KEY, roles),
    UseGuards(RolesGuard),
  );
}
