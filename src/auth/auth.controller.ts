import {
<<<<<<< HEAD
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
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto, ChangePasswordDto, UpdatePreferencesDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
=======
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService, UserProfile, AuthResponse } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616

@ApiTags('auth')
@Controller('auth')
export class AuthController {
<<<<<<< HEAD
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluşturur' })
    @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
    async register(@Req() req: any, @Body() dto: RegisterDto) {
        return this.authService.register(dto, req.ip, req.headers['user-agent']);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'E-posta (Simüle)' })
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto);
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Doğrulama tekrar gönder (Simüle)' })
    async resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Giriş yap' })
    @ApiResponse({ status: 200, description: 'Giriş başarılı ve otomatik doğrulandı' })
    async login(@Req() req: any, @Body() dto: LoginDto) {
        return this.authService.login(dto, req.ip, req.headers['user-agent']);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Token yenile' })
    async refreshToken(@Req() req: any, @Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refresh_token, req.ip, req.headers['user-agent']);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Çıkış yap' })
    async logout(
        @Req() req: any,
        @CurrentUser() user: { userId: string },
        @Body() dto?: RefreshTokenDto,
    ) {
        return this.authService.logout(user.userId, dto?.refresh_token, req.ip, req.headers['user-agent']);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Şifremi unuttum (Simüle)' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Şifre sıfırla (Simüle)' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Profil bilgisi' })
    async getProfile(@CurrentUser() user: { userId: string }) {
        return this.authService.getProfile(user.userId);
    }

    @Post('preferences')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tercihleri güncelle' })
    async updatePreferences(
        @CurrentUser() user: { userId: string },
        @Body() dto: UpdatePreferencesDto,
    ) {
        return this.authService.updatePreferences(user.userId, dto);
    }
=======
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Creates a new user registration' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async register(
    @Req() req: Request,
    @Body() dto: RegisterDto,
  ): Promise<AuthResponse> {
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, req.ip, userAgent);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifies email with verification code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(
    @Req() req: Request,
    @Body() dto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const userAgent = req.headers['user-agent'];
    return this.authService.verifyEmail(dto, req.ip, userAgent);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account locked or inactive' })
  async login(
    @Req() req: Request,
    @Body() dto: LoginDto,
  ): Promise<AuthResponse> {
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, req.ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
  })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  async refreshToken(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
  ): Promise<Omit<AuthResponse, 'user'>> {
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(dto.refresh_token, req.ip, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() req: Request,
    @CurrentUser() user: { userId: string },
    @Body() dto?: RefreshTokenDto,
  ): Promise<{ message: string }> {
    const userAgent = req.headers['user-agent'];
    return this.authService.logout(
      user.userId,
      dto?.refresh_token,
      req.ip,
      userAgent,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset link' })
  @ApiResponse({
    status: 200,
    description: 'Request received (user existence not revealed)',
  })
  async forgotPassword(
    @Req() req: Request,
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const userAgent = req.headers['user-agent'];
    return this.authService.forgotPassword(dto, req.ip, userAgent);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  async resetPassword(
    @Req() req: Request,
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const userAgent = req.headers['user-agent'];
    return this.authService.resetPassword(dto, req.ip, userAgent);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(
    @CurrentUser() user: { userId: string },
  ): Promise<UserProfile> {
    return this.authService.getProfile(user.userId);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Allows admin to create a user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created by admin',
  })
  async createUserByAdmin(
    @Body() dto: RegisterDto,
  ): Promise<Omit<User, 'password_hash'>> {
    return this.authService.createUserByAdmin(dto);
  }
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
