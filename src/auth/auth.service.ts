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
  ) {}

  async register(
    dto: RegisterDto,
    ip?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Bu e-posta adresi zaten kullanımda');
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
      `[MOCK EMAIL] Alıcı: ${user.email}, Konu: Hesap Doğrulama, Kod: ${email_verify_token}`,
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
      throw new BadRequestException('Geçersiz doğrulama kodu');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        is_email_verified: true,
        email_verify_token: null,
      },
    });

    await this.logEvent(AuditEvent.EMAIL_VERIFICATION, user.id, ip, userAgent);

    return { message: 'E-posta adresi başarıyla doğrulandı' };
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
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    // Check if user is locked
    if (user.locked_until && user.locked_until > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.locked_until.getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException(
        `Hesabınız kilitlendi. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`,
      );
    }

    // Check if user is active
    if (!user.is_active) {
      throw new ForbiddenException('Hesabınız aktif değil');
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
          `Çok fazla hatalı giriş denemesi nedeniyle hesabınız kilitlendi. ${lockoutDuration} dakika sonra tekrar deneyin.`,
        );
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_login_count },
      });

      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
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
        'Geçersiz veya süresi dolmuş yenileme jetonu (refresh token)',
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

    return { message: 'Başarıyla çıkış yapıldı' };
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
        message: 'Hesap mevcutsa, şifre sıfırlama bağlantısı gönderilmiştir.',
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
      `[MOCK EMAIL] Alıcı: ${user.email}, Konu: Şifre Sıfırlama, Kod: ${token}`,
    );

    await this.logEvent(
      AuditEvent.PASSWORD_RESET_REQUEST,
      user.id,
      ip,
      userAgent,
    );

    return {
      message: 'Hesap mevcutsa, şifre sıfırlama bağlantısı gönderilmiştir.',
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
        'Geçersiz veya süresi dolmuş sıfırlama kodu',
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

    return { message: 'Şifreniz başarıyla sıfırlandı' };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
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
      throw new BadRequestException('Bu e-posta adresi zaten kullanımda');
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
}
