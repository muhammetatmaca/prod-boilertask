import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto, ip?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            is_active: boolean;
            is_email_verified: boolean;
            email_verify_token: string | null;
            password_reset_token: string | null;
            password_reset_expires: Date | null;
            created_at: Date;
            updated_at: Date;
            last_login_at: Date | null;
            failed_login_count: number;
            locked_until: Date | null;
        };
    }>;
    verifyEmail(dto: VerifyEmailDto, ip?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            is_active: boolean;
            is_email_verified: boolean;
            email_verify_token: string | null;
            password_reset_token: string | null;
            password_reset_expires: Date | null;
            created_at: Date;
            updated_at: Date;
            last_login_at: Date | null;
            failed_login_count: number;
            locked_until: Date | null;
        };
    }>;
    refreshToken(refreshToken: string, ip?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>;
    logout(userId: string, refreshToken?: string, ip?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, ip?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, ip?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        is_email_verified: boolean;
    }>;
    createUserByAdmin(dto: RegisterDto, role?: Role): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        is_active: boolean;
        is_email_verified: boolean;
        email_verify_token: string | null;
        password_reset_token: string | null;
        password_reset_expires: Date | null;
        created_at: Date;
        updated_at: Date;
        last_login_at: Date | null;
        failed_login_count: number;
        locked_until: Date | null;
    }>;
    getAdminMetrics(): Promise<{
        userCount: number;
        auditCount: number;
        activeTokens: number;
        recentLogs: ({
            user: {
                email: string;
            };
        } & {
            id: string;
            created_at: Date;
            user_id: string | null;
            event: import(".prisma/client").$Enums.AuditEvent;
            ip_address: string | null;
            user_agent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    private logEvent;
    private generateTokens;
    private hashToken;
    private parseExpirationToSeconds;
    private excludePassword;
}
