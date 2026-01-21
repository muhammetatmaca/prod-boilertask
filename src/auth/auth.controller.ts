import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluşturur' })
    @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
    async register(@Req() req: any, @Body() dto: RegisterDto) {
        return this.authService.register(dto, req.ip, req.headers['user-agent']);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'E-posta adresini doğrulama kodu ile doğrular' })
    @ApiResponse({ status: 200, description: 'E-posta başarıyla doğrulandı' })
    async verifyEmail(@Req() req: any, @Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto, req.ip, req.headers['user-agent']);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'E-posta ve şifre ile giriş yapar ve token döner' })
    @ApiResponse({ status: 200, description: 'Giriş başarılı' })
    @ApiResponse({ status: 401, description: 'Hatalı bilgiler' })
    @ApiResponse({ status: 403, description: 'Hesap kilitli veya devre dışı' })
    async login(@Req() req: any, @Body() dto: LoginDto) {
        return this.authService.login(dto, req.ip, req.headers['user-agent']);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh token kullanarak yeni access token üretir' })
    @ApiResponse({ status: 200, description: 'Tokenlar başarıyla yenilendi' })
    async refreshToken(@Req() req: any, @Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refresh_token, req.ip, req.headers['user-agent']);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Oturumu kapatır ve tokenları geçersiz kılar' })
    @ApiResponse({ status: 200, description: 'Başarıyla çıkış yapıldı' })
    async logout(
        @Req() req: any,
        @CurrentUser() user: { userId: string },
        @Body() dto?: RefreshTokenDto,
    ) {
        return this.authService.logout(user.userId, dto?.refresh_token, req.ip, req.headers['user-agent']);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Şifre sıfırlama bağlantısı talep eder' })
    @ApiResponse({ status: 200, description: 'Talep alındı (güvenlik için kullanıcı varlığı belirtilmez)' })
    async forgotPassword(@Req() req: any, @Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto, req.ip, req.headers['user-agent']);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Token kullanarak şifreyi sıfırlar' })
    @ApiResponse({ status: 200, description: 'Şifre başarıyla güncellendi' })
    async resetPassword(@Req() req: any, @Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto, req.ip, req.headers['user-agent']);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Giriş yapmış kullanıcının profil bilgilerini getirir' })
    @ApiResponse({ status: 200, description: 'Profil başarıyla getirildi' })
    async getProfile(@CurrentUser() user: { userId: string }) {
        return this.authService.getProfile(user.userId);
    }

    @Post('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin tarafından kullanıcı oluşturulmasını sağlar' })
    @ApiResponse({ status: 201, description: 'Kullanıcı admin tarafından oluşturuldu' })
    async createUserByAdmin(@Body() dto: RegisterDto) {
        return this.authService.createUserByAdmin(dto);
    }
}
