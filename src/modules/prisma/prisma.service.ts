import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    let counter = 0;

    while (true) {
      try {
        await this.$connect();
        console.log('DB connected');
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 2000));
        counter++;
        console.log(`Retrying to connect to DB... ${counter}`);

        if (counter > 10) {
          console.error('DB connection failed');
          break;
        }
      }
    }
  }
}
