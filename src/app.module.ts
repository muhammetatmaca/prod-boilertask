import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
<<<<<<< HEAD
import { MailModule } from './mail/mail.module';
import { AdminController } from './admin/admin.controller';
import { ChatModule } from './chat/chat.module';
=======
import { AdminController } from './admin/admin.controller';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
<<<<<<< HEAD
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
=======
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
    PrismaModule,
    UsersModule,
    AuthModule,
    HealthModule,
<<<<<<< HEAD
    MailModule,
    ChatModule,
=======
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
<<<<<<< HEAD
export class AppModule { }
=======
export class AppModule {}
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
