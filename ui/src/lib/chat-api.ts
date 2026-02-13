
import { API_URL } from './auth';

export interface Chat {
    id: string;
    title: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    messages?: Message[];
}

export interface Message {
    id: string;
    chat_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export const chatApi = {
    async getUserChats(token: string): Promise<Chat[]> {
        const response = await fetch(`${API_URL}/chat`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Failed to fetch chats (${response.status})`);
        }
        return response.json();
    },

    async createChat(token: string, title?: string): Promise<Chat> {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Failed to create chat (${response.status})`);
        }
        return response.json();
    },

    async getChat(token: string, chatId: string): Promise<Chat> {
        const response = await fetch(`${API_URL}/chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Failed to get chat (${response.status})`);
        }
        return response.json();
    },

    async addMessage(token: string, chatId: string, role: string, content: string): Promise<{ userMessage: Message, assistantMessage?: Message, aiMessage?: Message }> {
        // Backend expects POST /chat/message with body { chatId, content }
        const response = await fetch(`${API_URL}/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ chatId, role, content })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            // Show REAL backend/AI error to user
            throw new Error(err.message || `Failed to send message (${response.status})`);
        }
        return response.json();
    },

    async deleteChat(token: string, chatId: string): Promise<void> {
        const response = await fetch(`${API_URL}/chat/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Failed to delete chat (${response.status})`);
        }
    }
};
