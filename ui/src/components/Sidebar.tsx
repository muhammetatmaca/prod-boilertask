import {
    Plus,
    Search,
    Settings,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Trash2,
    X,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

import { type Chat } from '../lib/chat-api'

export type PageView = 'chat' | 'search' | 'settings'

import { authApi, authStorage, type User } from '../lib/auth'

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
    activePage: PageView
    onNavigate: (page: PageView) => void
    user: User | null
    onLogin: () => void
    activeChatId: string | null
    onChatSelect: (chatId: string) => void
    onNewChat: () => void
    onDeleteChat: (chatId: string) => void
    chats: Chat[]
}

export default function Sidebar({
    isOpen,
    onToggle,
    activePage,
    onNavigate,
    user,
    onLogin,
    activeChatId,
    onChatSelect,
    onNewChat,
    onDeleteChat,
    chats
}: SidebarProps) {
    const { t } = useLanguage()

    const navItems: { icon: React.ElementType; label: string; page: PageView }[] = [
        { icon: Search, label: t.sidebar_search, page: 'search' },
        { icon: Settings, label: t.sidebar_settings, page: 'settings' },
    ]

    const handleLogout = async () => {
        const accessToken = authStorage.getAccessToken()
        const refreshToken = authStorage.getRefreshToken()
        if (accessToken && refreshToken) {
            try {
                await authApi.logout(accessToken, refreshToken)
            } catch (err) {
                console.error('Logout failed:', err)
            }
        }
        authStorage.clearTokens()
        window.location.reload()
    }

    const handleNewChatClick = () => {
        onNewChat()
        onNavigate('chat')
        // Close sidebar on mobile after action
        if (window.innerWidth < 768) onToggle()
    }

    const handleChatSelectMobile = (chatId: string) => {
        onChatSelect(chatId)
        if (window.innerWidth < 768) onToggle()
    }

    const handleNavMobile = (page: PageView) => {
        onNavigate(page)
        if (window.innerWidth < 768) onToggle()
    }

    const initial = user ? user.email.charAt(0).toUpperCase() : '?'

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative z-50 md:z-auto
                h-full flex flex-col bg-sidebar-bg border-r border-card-border/50
                transition-all duration-300 overflow-hidden
                ${isOpen
                    ? 'w-72 translate-x-0'
                    : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
                }
            `}>
                {/* Upper Content */}
                <div className={`flex-1 flex flex-col p-5 gap-6 overflow-hidden ${!isOpen ? 'items-center' : ''}`}>
                    {/* Toggle + New Chat */}
                    <div className="w-full flex items-center gap-2">
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
                        >
                            {isOpen
                                ? <span className="md:block"><PanelLeftClose size={18} className="text-text-secondary hidden md:block" /><X size={18} className="text-text-secondary md:hidden" /></span>
                                : <PanelLeftOpen size={18} className="text-text-secondary" />
                            }
                        </button>
                        {isOpen && (
                            <button
                                onClick={handleNewChatClick}
                                className="flex-1 h-9 px-3 py-2 bg-button-secondary-bg/70 rounded-lg backdrop-blur-lg flex items-center gap-2 hover:bg-sidebar-hover transition-colors group"
                            >
                                <Plus size={16} className="text-foreground" />
                                <span className="text-foreground text-sm font-medium">{t.sidebar_newChat}</span>
                            </button>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <div className="w-full flex flex-col gap-0.5">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavMobile(item.page)}
                                className={`w-full rounded-lg flex items-center px-3 py-2 transition-colors ${activePage === item.page ? 'bg-sidebar-active' : 'hover:bg-sidebar-hover'}`}
                                title={!isOpen ? item.label : undefined}
                            >
                                <item.icon size={16} className="text-foreground flex-shrink-0" />
                                {isOpen && <span className="text-foreground text-sm font-normal ml-2.5">{item.label}</span>}
                            </button>
                        ))}
                    </div>

                    {/* Chat History */}
                    {isOpen && (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="h-9 flex items-center px-3">
                                <span className="text-text-secondary text-xs font-medium flex items-center gap-1.5">
                                    <MessageSquare size={12} />
                                    {t.sidebar_chats}
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto flex flex-col">
                                {chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`w-full rounded-lg flex items-center px-3 py-2 transition-colors group cursor-pointer ${activeChatId === chat.id && activePage === 'chat'
                                            ? 'bg-sidebar-active'
                                            : 'hover:bg-sidebar-hover'
                                            }`}
                                        onClick={() => handleChatSelectMobile(chat.id)}
                                    >
                                        <span className="text-foreground text-sm font-normal leading-4 line-clamp-1 text-left flex-1 min-w-0">
                                            {chat.title}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (window.confirm('Bu sohbeti silmek istediginize emin misiniz?')) {
                                                    onDeleteChat(chat.id)
                                                }
                                            }}
                                            className="ml-1 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all flex-shrink-0"
                                            title="Sohbeti sil"
                                        >
                                            <Trash2 size={14} className="text-red-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom: Profile / Logout */}
                <div className="p-4 border-t border-card-border/30 bg-sidebar-bg/50 backdrop-blur-sm">
                    {user ? (
                        isOpen ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-600 font-bold">
                                        {initial}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-foreground text-sm font-medium truncate">
                                            {user?.email.split('@')[0]}
                                        </span>
                                        <span className="text-text-secondary text-[11px] truncate uppercase tracking-wider">
                                            {user?.role || 'User'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-red-500 text-xs font-medium px-1 hover:text-red-400 transition-colors"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-600 font-bold" title={user?.email}>
                                    {initial}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-400 transition-colors"
                                    title="Log out"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                                    </svg>
                                </button>
                            </div>
                        )
                    ) : (
                        /* Login button for guests */
                        <button
                            onClick={onLogin}
                            className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl transition-all ${isOpen ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'text-emerald-600 hover:bg-emerald-600/10'}`}
                            title="Sign In"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            {isOpen && <span className="text-sm font-semibold">Sign In</span>}
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
