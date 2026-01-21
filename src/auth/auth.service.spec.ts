import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_ACCESS_EXPIRATION: '15m',
        JWT_REFRESH_EXPIRATION: '7d',
        MAX_LOGIN_ATTEMPTS: '5',
        LOCKOUT_DURATION_MINUTES: '15',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-1234',
        email: dto.email,
        password_hash: hashedPassword,
        role: 'USER',
        is_active: true,
        is_email_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      mockPrismaService.auditLog.create.mockResolvedValue({});
      mockPrismaService.refreshToken.create.mockResolvedValue({
        token_hash: 'mock-hash',
        user_id: 'uuid-1234',
        expires_at: new Date(),
      });

      const result = await service.register(dto, '127.0.0.1', 'test-agent');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe(dto.email);
      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1234',
        email: dto.email,
        password_hash: hashedPassword,
        is_active: true,
        failed_login_count: 0,
        locked_until: null,
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.auditLog.create.mockResolvedValue({});
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      const result = await service.login(dto, '127.0.0.1', 'test-agent');

      expect(result).toHaveProperty('access_token');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token', async () => {
      const dto = { email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1234',
        email: 'test@example.com',
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.forgotPassword(dto);

      expect(result.message).toContain('reset link has been sent');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const dto = { token: 'valid-token' };
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'uuid-1234',
        email: 'test@example.com',
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.auditLog.create.mockResolvedValue({});

      const result = await service.verifyEmail(dto);

      expect(result.message).toBe('Email verified successfully');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });
});
