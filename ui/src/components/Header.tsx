import { ChevronDown, Moon, Sun, LogOut, Menu } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { type User } from '../lib/auth'

interface HeaderProps {
    theme: 'light' | 'dark'
    onToggleTheme: () => void
    user: User | null
    onNavigateProfile: () => void
    onLogout: () => void
    onOpenSidebar?: () => void
    sidebarOpen?: boolean
}

export default function Header({ theme, onToggleTheme, user, onNavigateProfile, onLogout, onOpenSidebar, sidebarOpen }: HeaderProps) {
    const { t } = useLanguage()
    const initial = user ? user.email.charAt(0).toUpperCase() : '?'

    return (
        <header className="w-full h-14 sm:h-16 px-3 sm:p-3 bg-background border-b border-card-border/50 flex items-center justify-between">
            {/* Left: Hamburger (mobile) + Logo + Model */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile hamburger menu */}
                {!sidebarOpen && (
                    <button
                        onClick={onOpenSidebar}
                        className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors md:hidden"
                    >
                        <Menu size={20} className="text-text-secondary" />
                    </button>
                )}

                <div className="h-10 px-1 sm:px-2.5 py-1.5 flex items-center gap-1">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Model Selector */}
                <button className="flex items-end gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity group">
                    <span className="text-foreground text-[11px] sm:text-xs font-semibold font-inter leading-4">
                        crudllm-26
                    </span>
                    <ChevronDown size={14} className="text-text-placeholder group-hover:text-text-secondary transition-colors" />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={onToggleTheme}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-sidebar-hover transition-all group"
                    title={theme === 'light' ? t.header_switchToDark : t.header_switchToLight}
                >
                    {theme === 'light' ? (
                        <Moon size={16} className="text-text-secondary group-hover:text-foreground transition-colors" />
                    ) : (
                        <Sun size={16} className="text-text-secondary group-hover:text-foreground transition-colors" />
                    )}
                </button>


                {user && (
                    <>
                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all group"
                            title="Log out"
                        >
                            <LogOut size={16} />
                        </button>

                        {/* Avatar */}
                        <div
                            onClick={onNavigateProfile}
                            className="w-7 h-7 sm:w-8 sm:h-8 px-1 sm:px-1.5 py-0.5 bg-slate-700/80 rounded-lg backdrop-blur-lg border border-white/5 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors"
                            title="Profile Settings"
                        >
                            <span className="text-white text-[10px] sm:text-xs font-bold leading-6">{initial}</span>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}
