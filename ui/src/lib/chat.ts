export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

// function removed

export function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
