import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
<<<<<<< HEAD
    async onModuleInit() {
        await this.$connect();
    }
=======
  async onModuleInit() {
    await this.$connect();
  }
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
