import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<Omit<{
        id: string;
        email: string;
        password_hash: string;
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
    }, "password_hash">[]>;
    getUserById(id: string): Promise<Omit<{
        id: string;
        email: string;
        password_hash: string;
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
    }, "password_hash">>;
    deleteUser(id: string): Promise<Omit<{
        id: string;
        email: string;
        password_hash: string;
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
    }, "password_hash">>;
}
