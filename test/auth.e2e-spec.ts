import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { App } from 'supertest/types';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
  message?: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res: { body: AuthResponse }) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body.user.email).toBe('test@example.com');
        });
    });

    it('should fail to register with existing email', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/register')
        .send({
          email: 'new@example.com',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res: { body: AuthResponse }) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
        });
    });

    it('should fail with wrong password', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('/auth/me (GET)', () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = (await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })) as { body: AuthResponse };
      accessToken = response.body.access_token;
    });

    it('should return user profile with valid token', () => {
      return request(app.getHttpServer() as App)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: { body: { email: string } }) => {
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer() as App)
        .get('/auth/me')
        .expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer() as App)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const response = (await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })) as { body: AuthResponse };
      refreshToken = response.body.refresh_token;
    });

    it('should refresh tokens with valid refresh token', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/refresh')
        .send({ refresh_token: refreshToken })
        .expect(200)
        .expect((res: { body: AuthResponse }) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
        });
    });

    it('should fail with invalid refresh token', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/refresh')
        .send({ refresh_token: 'invalid-token' })
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      const response = (await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })) as { body: AuthResponse };
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });

    it('should logout successfully', () => {
      return request(app.getHttpServer() as App)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refresh_token: refreshToken })
        .expect(200)
        .expect((res: { body: AuthResponse }) => {
          expect(res.body.message).toBe('Logged out successfully');
        });
    });
  });
});
