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
}
