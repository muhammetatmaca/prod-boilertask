import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<Omit<User, 'password_hash'> | null>;
    users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<Omit<User, 'password_hash'>[]>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<Omit<User, 'password_hash'>>;
}
