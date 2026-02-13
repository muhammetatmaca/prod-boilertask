import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
<<<<<<< HEAD
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
=======
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
