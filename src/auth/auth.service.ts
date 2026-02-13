<<<<<<< HEAD
import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, UpdatePreferencesDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role, User, AuditEvent } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) { }

    async register(dto: RegisterDto, ip?: string, userAgent?: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });

            if (existingUser) {
                if (existingUser.is_email_verified) {
                    throw new BadRequestException('Bu e-posta adresi zaten kullanımda');
                }

                // Kullanıcı var ama doğrulanmamış -> Yeni kod gönder
                const password_hash = await bcrypt.hash(dto.password, 10);
                const email_verify_token = randomBytes(32).toString('hex');

                const user = await this.prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password_hash,
                        email_verify_token,
                    },
                });

                try {
                    await this.mailService.sendVerificationEmail(user.email, email_verify_token);
                } catch (e) {
                    console.error('Mail Hatası (Register):', e);
                    // Hata fırlatma, kullanıcıya bilgi dön
                }

                await this.logEvent(AuditEvent.REGISTER, user.id, ip, userAgent, { email: user.email, note: 're-register' });

                return {
                    message: 'Doğrulama maili tekrar gönderildi. Lütfen e-postanızı kontrol edin.',
                    user: this.excludePassword(user),
                };
            }

            // Yeni Kullanıcı Oluşturma
            const password_hash = await bcrypt.hash(dto.password, 10);
            const email_verify_token = randomBytes(32).toString('hex');

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash,
                    is_email_verified: false, // Gerçek doğrulama gerekli
                    email_verify_token,
                    role: Role.USER,
                },
            });

            try {
                await this.mailService.sendVerificationEmail(user.email, email_verify_token);
            } catch (e) {
                console.error('Mail Hatası (Register):', e);
            }

            await this.logEvent(AuditEvent.REGISTER, user.id, ip, userAgent, { email: user.email });

            return {
                message: 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.',
                user: this.excludePassword(user),
            };
        } catch (error) {
            console.error('Register Error:', error);
            throw error;
        }
    }

    async verifyEmail(dto: VerifyEmailDto) {
        const user = await this.prisma.user.findFirst({
            where: { email_verify_token: dto.token },
        });

        if (!user) {
            throw new BadRequestException('Geçersiz veya süresi dolmuş kod.');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                is_email_verified: true,
                email_verify_token: null,
            },
        });

        await this.logEvent(AuditEvent.EMAIL_VERIFICATION, user.id);
        return { message: 'Hesabınız doğrulandı. Giriş yapabilirsiniz.' };
    }

    async resendVerification(dto: { email: string }) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) return { message: 'İşlem alındı.' };
        if (user.is_email_verified) throw new BadRequestException('Zaten doğrulanmış.');

        const token = randomBytes(32).toString('hex');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { email_verify_token: token }
        });

        try {
            await this.mailService.sendVerificationEmail(user.email, token);
        } catch (e) { console.error(e); }

        return { message: 'Doğrulama kodu tekrar gönderildi.' };
    }

    async login(dto: LoginDto, ip?: string, userAgent?: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı veya şifre yanlış');

        if (!user.is_active) throw new ForbiddenException('Hesap aktif değil');

        // E-posta doğrulama ZORUNLU
        if (!user.is_email_verified) {
            throw new ForbiddenException('Lütfen önce e-posta adresinizi doğrulayın.');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            const failed_login_count = user.failed_login_count + 1;
            await this.prisma.user.update({
                where: { id: user.id },
                data: { failed_login_count }
            });
            throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
        }

        // Başarılı Giriş
        await this.prisma.user.update({
            where: { id: user.id },
            data: { failed_login_count: 0, last_login_at: new Date(), locked_until: null }
        });
        await this.logEvent(AuditEvent.LOGIN, user.id, ip, userAgent);

        const tokens = await this.generateTokens(user);
        return {
            user: this.excludePassword(user),
            ...tokens,
        };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) return { message: 'Bağlantı gönderildi.' };

        // 6 Haneli sayısal kod (UX için)
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 3600000); // 1 saat

        await this.prisma.user.update({
            where: { id: user.id },
            data: { password_reset_token: token, password_reset_expires: expires }
        });

        try {
            await this.mailService.sendPasswordResetEmail(user.email, token);
        } catch (e) { console.error(e); }

        return { message: 'Şifre sıfırlama kodu mailinize gönderildi.' };
    }

    async verifyResetToken(token: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                password_reset_token: token,
                password_reset_expires: { gt: new Date() },
            },
        });
        if (!user) throw new BadRequestException('Geçersiz kod.');
        return { message: 'Kod geçerli', email: user.email };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                password_reset_token: dto.token,
                password_reset_expires: { gt: new Date() },
            },
        });

        if (!user) throw new BadRequestException('Geçersiz veya süresi dolmuş kod');

        const password_hash = await bcrypt.hash(dto.password, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash,
                password_reset_token: null,
                password_reset_expires: null,
                failed_login_count: 0,
            }
        });

        return { message: 'Şifreniz başarıyla sıfırlandı.' };
    }

    // --- Helpers ---

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
        return this.excludePassword(user);
    }

    async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
        await this.prisma.user.update({ where: { id: userId }, data: dto });
        return { message: 'Tercihler güncellendi' };
    }

    async refreshToken(refreshToken: string, ip?: string, userAgent?: string) {
        const tokenHash = this.hashToken(refreshToken);
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token_hash: tokenHash },
            include: { user: true }
        });

        if (!tokenRecord || tokenRecord.revoked || tokenRecord.expires_at < new Date()) {
            throw new UnauthorizedException('Geçersiz token');
        }

        await this.prisma.refreshToken.update({ where: { id: tokenRecord.id }, data: { revoked: true } });
        return this.generateTokens(tokenRecord.user);
    }

    async logout(userId: string, refreshToken?: string, ip?: string, userAgent?: string) {
        if (refreshToken) {
            const tokenHash = this.hashToken(refreshToken);
            await this.prisma.refreshToken.updateMany({
                where: { token_hash: tokenHash, user_id: userId },
                data: { revoked: true }
            });
        }
        return { message: 'Çıkış yapıldı' };
    }

    private async logEvent(event: AuditEvent, userId: string | null, ip?: string, userAgent?: string, metadata?: any) {
        await this.prisma.auditLog.create({
            data: { event, user_id: userId, ip_address: ip, user_agent: userAgent, metadata: metadata || {} },
        });
    }

    private async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET') || 'secret',
            expiresIn: '15m',
        });

        const refreshTokenValue = randomBytes(64).toString('hex');
        const tokenHash = this.hashToken(refreshTokenValue);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: { token_hash: tokenHash, user_id: user.id, expires_at: expiresAt },
        });

        return { access_token: accessToken, refresh_token: refreshTokenValue, expires_in: 900 };
    }

    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private excludePassword(user: User) {
        const { password_hash, ...rest } = user;
        return rest;
    }

    // Admin Stub (placeholder)
    async getAdminMetrics() { return { userCount: 0, auditCount: 0, activeTokens: 0, recentLogs: [] }; }
    async deleteAccount(userId: string) { return { message: 'Deleted' }; }
    async exportUserData(userId: string) { return {}; }
    async changePassword(userId: string, dto: any) { return { message: 'Changed' }; }
    async createUserByAdmin(dto: any) { return {}; }
=======
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role, User, AuditEvent, Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  is_email_verified: boolean;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AdminMetrics {
  userCount: number;
  auditCount: number;
  activeTokens: number;
  recentLogs: any[];
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(
    dto: RegisterDto,
    ip?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('This email is already in use');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const email_verify_token = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash,
        email_verify_token,
      },
    });

    // MOCK: Send verification email
    console.log(
      `[MOCK EMAIL] To: ${user.email}, Subject: Account Verification, Code: ${email_verify_token}`,
    );

    await this.logEvent(AuditEvent.REGISTER, user.id, ip, userAgent, {
      email: user.email,
    });

    const tokens = await this.generateTokens(user);
    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  async verifyEmail(
    dto: VerifyEmailDto,
    ip?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email_verify_token: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        is_email_verified: true,
        email_verify_token: null,
      },
    });

    await this.logEvent(AuditEvent.EMAIL_VERIFICATION, user.id, ip, userAgent);

    return { message: 'Email verified successfully' };
  }

  async login(
    dto: LoginDto,
    ip?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is locked
    if (user.locked_until && user.locked_until > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.locked_until.getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException(
        `Your account is locked. Please try again in ${remainingMinutes} minutes.`,
      );
    }

    // Check if user is active
    if (!user.is_active) {
      throw new ForbiddenException('Your account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      const maxAttempts = parseInt(
        this.configService.get<string>('MAX_LOGIN_ATTEMPTS') || '5',
        10,
      );
      const lockoutDuration = parseInt(
        this.configService.get<string>('LOCKOUT_DURATION_MINUTES') || '15',
        10,
      );

      const failed_login_count = user.failed_login_count + 1;

      if (failed_login_count >= maxAttempts) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failed_login_count,
            locked_until: new Date(Date.now() + lockoutDuration * 60000),
          },
        });
        throw new ForbiddenException(
          `Your account has been locked due to too many failed login attempts. Please try again in ${lockoutDuration} minutes.`,
        );
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_login_count },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failed_login_count: 0,
        locked_until: null,
        last_login_at: new Date(),
      },
    });

    await this.logEvent(AuditEvent.LOGIN, user.id, ip, userAgent);

    const tokens = await this.generateTokens(user);
    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  async refreshToken(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<Omit<AuthResponse, 'user'>> {
    const tokenHash = this.hashToken(refreshToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash },
      include: { user: true },
    });

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expires_at < new Date()
    ) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    await this.logEvent(AuditEvent.REFRESH, tokenRecord.user_id, ip, userAgent);

    const tokens = await this.generateTokens(tokenRecord.user);
    return tokens;
  }

  async logout(
    userId: string,
    refreshToken?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { token_hash: tokenHash, user_id: userId },
        data: { revoked: true },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { user_id: userId },
        data: { revoked: true },
      });
    }

    await this.logEvent(AuditEvent.LOGOUT, userId, ip, userAgent);

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
    ip?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't reveal user existence for security
      return {
        message: 'Account exists, reset link has been sent.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_reset_token: token,
        password_reset_expires: expires,
      },
    });

    // MOCK: Send reset email
    console.log(
      `[MOCK EMAIL] To: ${user.email}, Subject: Password Reset, Code: ${token}`,
    );

    await this.logEvent(
      AuditEvent.PASSWORD_RESET_REQUEST,
      user.id,
      ip,
      userAgent,
    );

    return {
      message: 'Account exists, reset link has been sent.',
    };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    ip?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        password_reset_token: dto.token,
        password_reset_expires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Invalid or expired reset code',
      );
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

    await this.logEvent(
      AuditEvent.PASSWORD_RESET_SUCCESS,
      user.id,
      ip,
      userAgent,
    );

    return { message: 'Password has been reset successfully' };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_email_verified: user.is_email_verified,
    };
  }

  async createUserByAdmin(
    dto: RegisterDto,
    role: Role = Role.USER,
  ): Promise<Omit<User, 'password_hash'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('This email is already in use');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash,
        role,
        is_email_verified: true, // Admins create verified users
      },
    });

    return this.excludePassword(user);
  }

  async getAdminMetrics(): Promise<AdminMetrics> {
    const [userCount, auditCount, activeTokens] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.auditLog.count(),
      this.prisma.refreshToken.count({
        where: { revoked: false, expires_at: { gt: new Date() } },
      }),
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
      recentLogs: recentLogs as any[],
    };
  }

  private async logEvent(
    event: AuditEvent,
    userId: string | null,
    ip?: string,
    userAgent?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        event,
        user_id: userId,
        ip_address: ip,
        user_agent: userAgent,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
      },
    });
  }

  private async generateTokens(
    user: User,
  ): Promise<Omit<AuthResponse, 'user'>> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m';

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessExpiresIn as Parameters<
        JwtService['sign']
      >[1]['expiresIn'],
    });

    const expiresInSeconds = this.parseExpirationToSeconds(accessExpiresIn);

    const refreshTokenValue = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshTokenValue);

    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = new Date();

    const match = refreshExpiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1], 10);
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
    } else {
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

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseExpirationToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (!match) return 900;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd':
        return value * 86400;
      case 'h':
        return value * 3600;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return 900;
    }
  }

  private excludePassword(user: User): Omit<User, 'password_hash'> {
    const { password_hash: _password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
