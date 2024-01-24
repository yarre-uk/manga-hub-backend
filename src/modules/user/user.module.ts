import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CacheModule.register()],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
