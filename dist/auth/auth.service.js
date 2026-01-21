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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto, ip, userAgent) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Bu e-posta adresi zaten kullanımda');
        }
        const password_hash = await bcrypt.hash(dto.password, 10);
        const email_verify_token = (0, crypto_1.randomBytes)(32).toString('hex');
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password_hash,
                email_verify_token,
            },
        });
        console.log(`[MOCK EMAIL] Alıcı: ${user.email}, Konu: Hesap Doğrulama, Kod: ${email_verify_token}`);
        await this.logEvent(client_1.AuditEvent.REGISTER, user.id, ip, userAgent, { email: user.email });
        const tokens = await this.generateTokens(user);
        return {
            user: this.excludePassword(user),
            ...tokens,
        };
    }
    async verifyEmail(dto, ip, userAgent) {
        const user = await this.prisma.user.findFirst({
            where: { email_verify_token: dto.token },
        });
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz doğrulama kodu');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                is_email_verified: true,
                email_verify_token: null,
            },
        });
        await this.logEvent(client_1.AuditEvent.EMAIL_VERIFICATION, user.id, ip, userAgent);
        return { message: 'E-posta adresi başarıyla doğrulandı' };
    }
    async login(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Geçersiz kimlik bilgileri');
        }
        if (user.locked_until && user.locked_until > new Date()) {
            const remainingMinutes = Math.ceil((user.locked_until.getTime() - Date.now()) / 60000);
            throw new common_1.ForbiddenException(`Hesabınız kilitlendi. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`);
        }
        if (!user.is_active) {
            throw new common_1.ForbiddenException('Hesabınız aktif değil');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            const maxAttempts = parseInt(this.configService.get('MAX_LOGIN_ATTEMPTS') || '5');
            const lockoutDuration = parseInt(this.configService.get('LOCKOUT_DURATION_MINUTES') || '15');
            const failed_login_count = user.failed_login_count + 1;
            if (failed_login_count >= maxAttempts) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failed_login_count,
                        locked_until: new Date(Date.now() + lockoutDuration * 60000),
                    },
                });
                throw new common_1.ForbiddenException(`Çok fazla hatalı giriş denemesi nedeniyle hesabınız kilitlendi. ${lockoutDuration} dakika sonra tekrar deneyin.`);
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { failed_login_count },
            });
            throw new common_1.UnauthorizedException('Geçersiz kimlik bilgileri');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_count: 0,
                locked_until: null,
                last_login_at: new Date(),
            },
        });
        await this.logEvent(client_1.AuditEvent.LOGIN, user.id, ip, userAgent);
        const tokens = await this.generateTokens(user);
        return {
            user: this.excludePassword(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken, ip, userAgent) {
        const tokenHash = this.hashToken(refreshToken);
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token_hash: tokenHash },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.revoked || tokenRecord.expires_at < new Date()) {
            throw new common_1.UnauthorizedException('Geçersiz veya süresi dolmuş yenileme jetonu (refresh token)');
        }
        await this.prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { revoked: true },
        });
        await this.logEvent(client_1.AuditEvent.REFRESH, tokenRecord.user_id, ip, userAgent);
        const tokens = await this.generateTokens(tokenRecord.user);
        return tokens;
    }
    async logout(userId, refreshToken, ip, userAgent) {
        if (refreshToken) {
            const tokenHash = this.hashToken(refreshToken);
            await this.prisma.refreshToken.updateMany({
                where: { token_hash: tokenHash, user_id: userId },
                data: { revoked: true },
            });
        }
        else {
            await this.prisma.refreshToken.updateMany({
                where: { user_id: userId },
                data: { revoked: true },
            });
        }
        await this.logEvent(client_1.AuditEvent.LOGOUT, userId, ip, userAgent);
        return { message: 'Başarıyla çıkış yapıldı' };
    }
    async forgotPassword(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return { message: 'Hesap mevcutsa, şifre sıfırlama bağlantısı gönderilmiştir.' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password_reset_token: token,
                password_reset_expires: expires,
            },
        });
        console.log(`[MOCK EMAIL] Alıcı: ${user.email}, Konu: Şifre Sıfırlama, Kod: ${token}`);
        await this.logEvent(client_1.AuditEvent.PASSWORD_RESET_REQUEST, user.id, ip, userAgent);
        return { message: 'Hesap mevcutsa, şifre sıfırlama bağlantısı gönderilmiştir.' };
    }
    async resetPassword(dto, ip, userAgent) {
        const user = await this.prisma.user.findFirst({
            where: {
                password_reset_token: dto.token,
                password_reset_expires: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz veya süresi dolmuş sıfırlama kodu');
        }
        const password_hash = await bcrypt.hash(dto.password, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash,
                password_reset_token: null,
                password_reset_expires: null,
                failed_login_count: 0,
                locked_until: null,
            },
        });
        await this.logEvent(client_1.AuditEvent.PASSWORD_RESET_SUCCESS, user.id, ip, userAgent);
        return { message: 'Şifreniz başarıyla sıfırlandı' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Kullanıcı bulunamadı');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            is_email_verified: user.is_email_verified,
        };
    }
    async createUserByAdmin(dto, role = client_1.Role.USER) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Bu e-posta adresi zaten kullanımda');
        }
        const password_hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password_hash,
                role,
                is_email_verified: true,
            },
        });
        return this.excludePassword(user);
    }
    async getAdminMetrics() {
        const [userCount, auditCount, activeTokens] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.auditLog.count(),
            this.prisma.refreshToken.count({ where: { revoked: false, expires_at: { gt: new Date() } } }),
        ]);
        const recentLogs = await this.prisma.auditLog.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: { user: { select: { email: true } } },
        });
        return {
            userCount,
            auditCount,
            activeTokens,
            recentLogs,
        };
    }
    async logEvent(event, userId, ip, userAgent, metadata) {
        await this.prisma.auditLog.create({
            data: {
                event,
                user_id: userId,
                ip_address: ip,
                user_agent: userAgent,
                metadata: metadata || {},
            },
        });
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessExpiresIn = this.configService.get('JWT_ACCESS_EXPIRATION') || '15m';
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: accessExpiresIn,
        });
        const expiresInSeconds = this.parseExpirationToSeconds(accessExpiresIn);
        const refreshTokenValue = (0, crypto_1.randomBytes)(64).toString('hex');
        const tokenHash = this.hashToken(refreshTokenValue);
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRATION') || '7d';
        const expiresAt = new Date();
        const match = refreshExpiresIn.match(/^(\d+)([dhms])$/);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            switch (unit) {
                case 'd':
                    expiresAt.setDate(expiresAt.getDate() + value);
                    break;
                case 'h':
                    expiresAt.setHours(expiresAt.getHours() + value);
                    break;
                case 'm':
                    expiresAt.setMinutes(expiresAt.getMinutes() + value);
                    break;
                case 's':
                    expiresAt.setSeconds(expiresAt.getSeconds() + value);
                    break;
            }
        }
        else {
            expiresAt.setDate(expiresAt.getDate() + 7);
        }
        await this.prisma.refreshToken.create({
            data: {
                token_hash: tokenHash,
                user_id: user.id,
                expires_at: expiresAt,
            },
        });
        return {
            access_token: accessToken,
            refresh_token: refreshTokenValue,
            expires_in: expiresInSeconds,
        };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    parseExpirationToSeconds(expiration) {
        const match = expiration.match(/^(\d+)([dhms])$/);
        if (!match)
            return 900;
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case 'd': return value * 86400;
            case 'h': return value * 3600;
            case 'm': return value * 60;
            case 's': return value;
            default: return 900;
        }
    }
    excludePassword(user) {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map