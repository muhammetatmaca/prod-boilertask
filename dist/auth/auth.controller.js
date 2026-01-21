"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, dto) {
        return this.authService.register(dto, req.ip, req.headers['user-agent']);
    }
    async verifyEmail(req, dto) {
        return this.authService.verifyEmail(dto, req.ip, req.headers['user-agent']);
    }
    async login(req, dto) {
        return this.authService.login(dto, req.ip, req.headers['user-agent']);
    }
    async refreshToken(req, dto) {
        return this.authService.refreshToken(dto.refresh_token, req.ip, req.headers['user-agent']);
    }
    async logout(req, user, dto) {
        return this.authService.logout(user.userId, dto?.refresh_token, req.ip, req.headers['user-agent']);
    }
    async forgotPassword(req, dto) {
        return this.authService.forgotPassword(dto, req.ip, req.headers['user-agent']);
    }
    async resetPassword(req, dto) {
        return this.authService.resetPassword(dto, req.ip, req.headers['user-agent']);
    }
    async getProfile(user) {
        return this.authService.getProfile(user.userId);
    }
    async createUserByAdmin(dto) {
        return this.authService.createUserByAdmin(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Yeni kullanıcı kaydı oluşturur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'E-posta adresini doğrulama kodu ile doğrular' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'E-posta başarıyla doğrulandı' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'E-posta ve şifre ile giriş yapar ve token döner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Giriş başarılı' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Hatalı bilgiler' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Hesap kilitli veya devre dışı' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh token kullanarak yeni access token üretir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokenlar başarıyla yenilendi' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Oturumu kapatır ve tokenları geçersiz kılar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Başarıyla çıkış yapıldı' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Şifre sıfırlama bağlantısı talep eder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Talep alındı (güvenlik için kullanıcı varlığı belirtilmez)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Token kullanarak şifreyi sıfırlar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şifre başarıyla güncellendi' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Giriş yapmış kullanıcının profil bilgilerini getirir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil başarıyla getirildi' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin tarafından kullanıcı oluşturulmasını sağlar' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kullanıcı admin tarafından oluşturuldu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUserByAdmin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map