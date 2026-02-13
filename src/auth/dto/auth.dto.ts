<<<<<<< HEAD
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'kullanici@ornek.com', description: 'Kullanıcının e-posta adresi' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'sifre123', minLength: 6, description: 'Güçlü bir şifre (en az 6 karakter)' })
    @IsString()
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'kullanici@ornek.com', description: 'Kayıtlı e-posta adresi' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'sifre123', description: 'Kullanıcı şifresi' })
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: 'abc123...', description: 'Yenileme jetonu (refresh token)' })
    @IsString()
    refresh_token: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'kullanici@ornek.com', description: 'Şifresi unutulan e-posta adresi' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'reset-token-123', description: 'E-posta ile gönderilen yenileme kodu' })
    @IsString()
    token: string;

    @ApiProperty({ example: 'yeni_sifre123', minLength: 6, description: 'Yeni belirlenen şifre' })
    @IsString()
    @MinLength(6)
    password: string;
}

export class VerifyEmailDto {
    @ApiProperty({ example: 'verify-token-123', description: 'E-posta adresine gönderilen doğrulama kodu' })
    @IsString()
    token: string;
}

export class ResendVerificationDto {
    @ApiProperty({ example: 'kullanici@ornek.com', description: 'Doğrulama kodu istenen e-posta adresi' })
    @IsEmail()
    email: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'eski_sifre123', description: 'Mevcut şifre' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'yeni_sifre123', minLength: 6, description: 'Yeni belirlenen şifre' })
    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class UpdatePreferencesDto {
    @ApiProperty({ example: 'dark', required: false })
    @IsOptional()
    @IsString()
    theme?: string;

    @ApiProperty({ example: 'large', required: false })
    @IsOptional()
    @IsString()
    font_size?: string;

    @ApiProperty({ example: 'en', required: false })
    @IsOptional()
    @IsString()
    language?: string;

    @ApiProperty({ example: 'crudllm-26-pro', required: false })
    @IsOptional()
    @IsString()
    default_model?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    send_with_enter?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    chat_history_enabled?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    data_collection?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    wide_chat?: boolean;
=======
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'kullanici@ornek.com',
    description: 'Kullanıcının e-posta adresi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'sifre123',
    minLength: 6,
    description: 'Güçlü bir şifre (en az 6 karakter)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'kullanici@ornek.com',
    description: 'Kayıtlı e-posta adresi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sifre123', description: 'Kullanıcı şifresi' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'abc123...',
    description: 'Yenileme jetonu (refresh token)',
  })
  @IsString()
  refresh_token: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'kullanici@ornek.com',
    description: 'Şifresi unutulan e-posta adresi',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-123',
    description: 'E-posta ile gönderilen yenileme kodu',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'yeni_sifre123',
    minLength: 6,
    description: 'Yeni belirlenen şifre',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: 'verify-token-123',
    description: 'E-posta adresine gönderilen doğrulama kodu',
  })
  @IsString()
  token: string;
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
