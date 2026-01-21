"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJS Kimlik Doğrulama API')
        .setDescription('Gelişmiş özelliklere sahip kullanıcı kimlik doğrulama ve yönetim API dökümantasyonu.')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Kimlik doğrulama, kayıt ve şifre işlemleri')
        .addTag('users', 'Kullanıcı yönetimi (Admin)')
        .addTag('admin', 'Sistem metrikleri ve denetim kayıtları')
        .addTag('health', 'Servis sağlık kontrolü')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Uygulama şu adreste çalışıyor: http://localhost:${port}`);
    console.log(`Swagger dökümantasyonu: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map