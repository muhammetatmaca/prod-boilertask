import { AuthService } from '../auth/auth.service';
export declare class AdminController {
    private readonly authService;
    constructor(authService: AuthService);
    getMetrics(): Promise<{
        userCount: number;
        auditCount: number;
        activeTokens: number;
        recentLogs: ({
            user: {
                email: string;
            };
        } & {
            id: string;
            created_at: Date;
            user_id: string | null;
            event: import(".prisma/client").$Enums.AuditEvent;
            ip_address: string | null;
            user_agent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
}
