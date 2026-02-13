
import { useState, useRef, useEffect, useCallback } from 'react'
import Header from './Header'
import ChatInput from './ChatInput'
import QuickActions from './QuickActions'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import type { Message } from '../lib/chat'
import { generateId } from '../lib/chat'
import { chatApi } from '../lib/chat-api'
import { authStorage } from '../lib/auth'
import { useLanguage } from '../i18n/LanguageContext'
import { type User } from '../lib/auth'

interface ChatAreaProps {
    userName?: string
    theme: 'light' | 'dark'
    onToggleTheme: () => void
    user: User | null
    onAuthRequired: () => void
    onNavigateProfile: () => void
    onLogout: () => void
    chatId: string | null
    onChatCreated: (chatId: string) => void
    onOpenSidebar?: () => void
    sidebarOpen?: boolean
}

export default function ChatArea({
    userName = 'Misafir',
    theme,
    onToggleTheme,
    user,
    onAuthRequired,
    onNavigateProfile,
    onLogout,
    chatId,
    onChatCreated,
    onOpenSidebar,
    sidebarOpen
}: ChatAreaProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [prefillText, setPrefillText] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { t } = useLanguage()
    const isSendingRef = useRef(false)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        // Skip reload if we're in the middle of sending a message
        // (onChatCreated triggers chatId change, which would wipe optimistic messages)
        if (isSendingRef.current) return;

        if (chatId && user) {
            const token = authStorage.getAccessToken();
            if (token) {
                chatApi.getChat(token, chatId).then(chat => {
                    const loadedMessages: Message[] = (chat.messages || []).map(m => ({
                        id: m.id,
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                        timestamp: new Date(m.created_at)
                    }));
                    setMessages(loadedMessages);
                }).catch(err => console.error(err));
            }
        } else {
            setMessages([]);
        }
    }, [chatId, user]);

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping, scrollToBottom])

    const handleSend = async (content: string) => {
        if (!user) {
            onAuthRequired()
            return
        }

        const token = authStorage.getAccessToken();
        if (!token) return;

        // Mark that we're sending - prevents useEffect from wiping messages
        isSendingRef.current = true;

        // 1. Optimistic Update (Show user message immediately)
        const tempId = generateId();
        const tempUserMsg: Message = {
            id: tempId,
            role: 'user',
            content,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, tempUserMsg]);
        setIsTyping(true);

        let newlyCreatedChatId: string | null = null;

        try {
            let currentChatId = chatId;

            // 2. Create Chat if needed
            if (!currentChatId) {
                const newChat = await chatApi.createChat(token, content.substring(0, 30));
                currentChatId = newChat.id;
                newlyCreatedChatId = newChat.id;
            }

            // 3. Send Message
            const response = await chatApi.addMessage(token, currentChatId, 'user', content);

            // 4. Update State with Real Messages
            setMessages(prev => {
                // Remove temp message
                const filtered = prev.filter(m => m.id !== tempId);

                // Add real user message + AI message
                const newMessages = [...filtered];

                if (response.userMessage) {
                    newMessages.push({
                        id: response.userMessage.id,
                        role: 'user',
                        content: response.userMessage.content,
                        timestamp: new Date(response.userMessage.created_at)
                    });
                }

                // Backend returns "aiMessage", handle both key names for safety
                const aiMsg = response.aiMessage || response.assistantMessage;
                if (aiMsg) {
                    newMessages.push({
                        id: aiMsg.id,
                        role: 'assistant',
                        content: aiMsg.content,
                        timestamp: new Date(aiMsg.created_at)
                    });
                }

                return newMessages;
            });

            // 5. NOW notify parent about the new chat (after messages are set)
            if (newlyCreatedChatId) {
                onChatCreated(newlyCreatedChatId);
            }

        } catch (error: any) {
            console.error('Failed to send message:', error);
            // Revert state
            setMessages(prev => prev.filter(m => m.id !== tempId));
            alert(`Hata: ${error.message || 'Mesaj gonderilemedi'}`);
        } finally {
            setIsTyping(false)
            // Allow useEffect to reload messages again after a short delay
            setTimeout(() => {
                isSendingRef.current = false;
            }, 500);
        }
    }

    const isEmptyChat = messages.length === 0 && !chatId

    return (
        <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
            <Header
                theme={theme}
                onToggleTheme={onToggleTheme}
                user={user}
                onNavigateProfile={onNavigateProfile}
                onLogout={onLogout}
                onOpenSidebar={onOpenSidebar}
                sidebarOpen={sidebarOpen}
            />

            {isEmptyChat ? (
                <main className="flex-1 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 sm:gap-5 overflow-auto">
                    <div className="flex flex-col items-center gap-2 sm:gap-3 text-center px-2">
                        <h1 className="text-2xl sm:text-4xl font-normal font-playfair leading-8 sm:leading-10">
                            <span className="text-foreground">{t.chat_hey}</span>{' '}
                            <span className="text-text-secondary">{userName}</span>
                        </h1>
                        <h2 className="text-foreground text-2xl sm:text-4xl font-normal font-playfair leading-8 sm:leading-10">
                            {t.chat_whatCanIHelp}
                        </h2>
                    </div>
                    <ChatInput onSend={handleSend} disabled={isTyping} prefillText={prefillText} onPrefillConsumed={() => setPrefillText('')} />
                    <QuickActions onAction={(prompt) => setPrefillText(prompt)} disabled={isTyping} />
                </main>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
                        <div className="mx-auto space-y-4 sm:space-y-5" style={{ maxWidth: 'var(--chat-max-width)' }}>
                            {messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-t border-card-border/30 flex justify-center">
                        <ChatInput onSend={handleSend} disabled={isTyping} />
                    </div>
                </>
            )}
        </div>
    )
}
