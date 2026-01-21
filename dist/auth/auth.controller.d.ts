import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(req: any, dto: RegisterDto): Promise<{
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
    verifyEmail(req: any, dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    login(req: any, dto: LoginDto): Promise<{
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
    refreshToken(req: any, dto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>;
    logout(req: any, user: {
        userId: string;
    }, dto?: RefreshTokenDto): Promise<{
        message: string;
    }>;
    forgotPassword(req: any, dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(req: any, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(user: {
        userId: string;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        is_email_verified: boolean;
    }>;
    createUserByAdmin(dto: RegisterDto): Promise<{
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
}
