import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

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
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('user');
                    expect(res.body).toHaveProperty('accessToken');
                    expect(res.body).toHaveProperty('refreshToken');
                    expect(res.body.user.email).toBe('test@example.com');
                    expect(res.body.user).not.toHaveProperty('password');
                });
        });

        it('should fail to register with existing email', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                })
                .expect(400);
        });

        it('should fail with invalid email', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                })
                .expect(400);
        });

        it('should fail with short password', () => {
            return request(app.getHttpServer())
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
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('user');
                    expect(res.body).toHaveProperty('accessToken');
                    expect(res.body).toHaveProperty('refreshToken');
                });
        });

        it('should fail with wrong password', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                })
                .expect(401);
        });

        it('should fail with non-existent email', () => {
            return request(app.getHttpServer())
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
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });
            accessToken = response.body.accessToken;
        });

        it('should return user profile with valid token', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).toBe('test@example.com');
                    expect(res.body).not.toHaveProperty('password');
                });
        });

        it('should fail without token', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .expect(401);
        });

        it('should fail with invalid token', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });

    describe('/auth/refresh (POST)', () => {
        let refreshToken: string;

        beforeAll(async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });
            refreshToken = response.body.refreshToken;
        });

        it('should refresh tokens with valid refresh token', () => {
            return request(app.getHttpServer())
                .post('/auth/refresh')
                .send({ refreshToken })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('accessToken');
                    expect(res.body).toHaveProperty('refreshToken');
                });
        });

        it('should fail with invalid refresh token', () => {
            return request(app.getHttpServer())
                .post('/auth/refresh')
                .send({ refreshToken: 'invalid-token' })
                .expect(401);
        });
    });

    describe('/auth/logout (POST)', () => {
        let accessToken: string;
        let refreshToken: string;

        beforeAll(async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        it('should logout successfully', () => {
            return request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ refreshToken })
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Logged out successfully');
                });
        });
    });
});
