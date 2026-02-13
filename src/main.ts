<<<<<<< HEAD

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
=======
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // 1. Enable CORS for Frontend Access (Port 5173/5174)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Enable Validation (DTOs)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
=======
  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS Advanced Auth API')
    .setDescription(
      'Advanced user authentication and management API documentation.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication, registration and password operations')
    .addTag('users', 'User management (Admin)')
    .addTag('admin', 'System metrics and audit logs')
    .addTag('health', 'Service health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
