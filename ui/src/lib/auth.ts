export const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000';

export interface User {
    id: string;
    email: string;
    role: string;
    preferences?: {
        theme?: string;
        font_size?: string;
        language?: string;
        default_model?: string;
        send_with_enter?: boolean;
        chat_history_enabled?: boolean;
        data_collection?: boolean;
        wide_chat?: boolean;
    }
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export const authApi = {
    // ... (previous methods)
    async register(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    },

    async verifyEmail(token: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Email verification failed');
        }
    },

    async resendVerification(email: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to resend verification code');
        }
    },

    async forgotPassword(email: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Forgot password request failed');
        }
    },

    async verifyResetToken(token: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Reset token verification failed');
        }
    },

    async resetPassword(token: string, password: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Password reset failed');
        }
    },

    async me(accessToken: string): Promise<User> {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return response.json();
    },

    async refresh(refresh_token: string): Promise<{ access_token: string; refresh_token: string }> {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token }),
        });
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
        return response.json();
    },

    async logout(accessToken: string, refresh_token: string): Promise<void> {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh_token }),
        });
    },

    async changePassword(accessToken: string, currentPassword: string, newPassword: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Password change failed');
        }
    },

    async deleteAccount(accessToken: string): Promise<void> {
        const response = await fetch(`${API_URL}/auth/delete-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Account deletion failed');
        }
    },

    async updatePreferences(accessToken: string, preferences: User['preferences']): Promise<void> {
        const response = await fetch(`${API_URL}/auth/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(preferences)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update preferences');
        }
    },

    async exportData(accessToken: string): Promise<any> {
        const response = await fetch(`${API_URL}/auth/export`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Data export failed');
        }
        return response.json();
    }
};

export const authStorage = {
    setTokens(access: string, refresh: string) {
        localStorage.setItem('crudllm-access-token', access);
        localStorage.setItem('crudllm-refresh-token', refresh);
    },
    getAccessToken() {
        return localStorage.getItem('crudllm-access-token');
    },
    getRefreshToken() {
        return localStorage.getItem('crudllm-refresh-token');
    },
    clearTokens() {
        localStorage.removeItem('crudllm-access-token');
        localStorage.removeItem('crudllm-refresh-token');
    }
};
