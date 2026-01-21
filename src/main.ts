import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .setTitle('NestJS Kimlik Doğrulama API')
    .setDescription(
      'Gelişmiş özelliklere sahip kullanıcı kimlik doğrulama ve yönetim API dökümantasyonu.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Kimlik doğrulama, kayıt ve şifre işlemleri')
    .addTag('users', 'Kullanıcı yönetimi (Admin)')
    .addTag('admin', 'Sistem metrikleri ve denetim kayıtları')
    .addTag('health', 'Servis sağlık kontrolü')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Uygulama şu adreste çalışıyor: http://localhost:${port}`);
  console.log(`Swagger dökümantasyonu: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Uygulama başlatılamadı:', err);
  process.exit(1);
});
