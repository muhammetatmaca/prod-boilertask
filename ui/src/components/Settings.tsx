import { useState, useEffect } from 'react'
import {
    User,
    Palette,
    Shield,
    Check,
    Monitor,
    Moon,
    Sun,
    ChevronRight,
    LogOut,
    Trash2,
    Download,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { languageNames, type Language } from '../i18n/translations'
import { authApi, authStorage, type User as UserType } from '../lib/auth'
import { type Theme } from '../hooks/useTheme'
import { type FontSize } from '../hooks/useFontSize'

interface SettingsProps {
    onBack: () => void
    initialTab?: SettingsTab
    user: UserType | null
    onLogout: () => void
    theme: Theme
    setTheme: (t: Theme) => void
    fontSize: FontSize
    setFontSize: (s: FontSize) => void
    wideChat: boolean
    setWideChat: (w: boolean) => void
}

type SettingsTab = 'general' | 'profile' | 'appearance' | 'privacy'

interface TabItem {
    id: SettingsTab
    label: string
    icon: React.ElementType
    description: string
}

export default function Settings({ onBack, initialTab = 'general', user, onLogout, theme, setTheme, fontSize, setFontSize, wideChat, setWideChat }: SettingsProps) {
    const { t, language, setLanguage } = useLanguage()
    const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
    const [model, setModel] = useState('crudllm-26')
    const [sendWithEnter, setSendWithEnter] = useState(true)
    const [chatHistory, setChatHistory] = useState(true)

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [showPasswords, setShowPasswords] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Initialize state from user preferences
    useEffect(() => {
        if (user?.preferences) {
            if (user.preferences.default_model) setModel(user.preferences.default_model)
            if (user.preferences.send_with_enter !== undefined) setSendWithEnter(user.preferences.send_with_enter)
            if (user.preferences.chat_history_enabled !== undefined) setChatHistory(user.preferences.chat_history_enabled)
        }
    }, [user])

    const tabs: TabItem[] = [
        { id: 'general', label: t.settings_tab_general, icon: Monitor, description: t.settings_tab_general_desc },
        { id: 'profile', label: t.settings_tab_profile, icon: User, description: t.settings_tab_profile_desc },
        { id: 'appearance', label: t.settings_tab_appearance, icon: Palette, description: t.settings_tab_appearance_desc },
        { id: 'privacy', label: t.settings_tab_privacy, icon: Shield, description: t.settings_tab_privacy_desc },
    ]

    // Sync preferences with backend when they change
    useEffect(() => {
        const syncPreferences = async () => {
            const token = authStorage.getAccessToken()
            if (user && token) {
                try {
                    await authApi.updatePreferences(token, {
                        theme,
                        font_size: fontSize,
                        language,
                        default_model: model,
                        send_with_enter: sendWithEnter,
                        chat_history_enabled: chatHistory,
                        wide_chat: wideChat,
                    })
                } catch (err) {
                    console.error('Failed to sync preferences:', err)
                }
            }
        }

        // Avoid syncing on initial mount if possible, or just let it sync
        syncPreferences()
    }, [theme, fontSize, language, model, sendWithEnter, chatHistory, wideChat, user])

    const handleDeleteAccount = async () => {
        if (!user) return

        setIsDeleteLoading(true)
        try {
            const token = authStorage.getAccessToken()
            if (!token) throw new Error('Oturum bulunamadı')
            await authApi.deleteAccount(token)
            setIsDeleteModalOpen(false)
            onLogout()
        } catch (err: any) {
            alert(err.message || 'Hesap silinemedi')
            setIsDeleteLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (newPassword !== confirmPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor')
            return
        }

        if (newPassword.length < 6) {
            setPasswordError('Şifre en az 6 karakter olmalıdır')
            return
        }

        setIsPasswordLoading(true)
        setPasswordError(null)
        setPasswordSuccess(false)

        try {
            const token = authStorage.getAccessToken()
            if (!token) throw new Error('Token bulunamadı')
            await authApi.changePassword(token, currentPassword, newPassword)
            setPasswordSuccess(true)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setPasswordSuccess(false), 5000)
        } catch (err: any) {
            setPasswordError(err.message || 'Şifre değiştirilemedi')
        } finally {
            setIsPasswordLoading(false)
        }
    }

    const handleExportData = async () => {
        try {
            const token = authStorage.getAccessToken()
            if (!token) throw new Error('Token bulunamadı')

            const data = await authApi.exportData(token)

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `crudllm-data-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err: any) {
            alert(err.message || 'Veriler dışa aktarılamadı')
        }
    }

    const userInitial = user ? user.email.charAt(0).toUpperCase() : '?'

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        {/* Language */}
                        <SettingRow label={t.settings_language} description={t.settings_language_desc}>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-button-primary-bg/20 transition-all"
                            >
                                {(Object.keys(languageNames) as Language[]).map((lang) => (
                                    <option key={lang} value={lang}>
                                        {languageNames[lang]}
                                    </option>
                                ))}
                            </select>
                        </SettingRow>

                        {/* Default Model */}
                        <SettingRow label={t.settings_defaultModel} description={t.settings_defaultModel_desc}>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-button-primary-bg/20 transition-all"
                            >
                                <option value="crudllm-26">crudllm-26</option>
                            </select>
                        </SettingRow>

                        {/* Send with Enter */}
                        <SettingRow label={t.settings_sendWithEnter} description={t.settings_sendWithEnter_desc}>
                            <Toggle checked={sendWithEnter} onChange={setSendWithEnter} />
                        </SettingRow>
                    </div>
                )

            case 'profile':
                return (
                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4 p-4 bg-card-background/50 rounded-xl border border-card-border/50">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl font-bold">{userInitial}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-foreground text-sm font-medium">{t.settings_profilePhoto}</p>
                                <p className="text-text-secondary text-xs mt-0.5">{t.settings_profilePhoto_desc}</p>
                            </div>
                        </div>

                        {/* Name */}
                        <SettingRow label={t.settings_displayName} description={t.settings_displayName_desc}>
                            <input
                                type="text"
                                readOnly
                                value={user?.email.split('@')[0] || ''}
                                className="px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none w-56 opacity-80 cursor-not-allowed"
                            />
                        </SettingRow>

                        {/* Email */}
                        <SettingRow label={t.settings_email} description={t.settings_email_desc}>
                            <input
                                type="email"
                                readOnly
                                value={user?.email || ''}
                                className="px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none w-56 opacity-80 cursor-not-allowed"
                            />
                        </SettingRow>

                        {/* Role (Static but real) */}
                        <SettingRow label="Account Type" description="Your current account tier and permissions.">
                            <span className="px-3 py-1.5 bg-sidebar-active rounded-lg text-foreground text-xs font-medium border border-card-border/50 uppercase tracking-wider">
                                {user?.role || 'User'}
                            </span>
                        </SettingRow>

                        {/* Security Section (Change Password) */}
                        <div className="pt-6 mt-6 border-t border-card-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock size={16} className="text-emerald-500" />
                                <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider">Güvenlik</h3>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-text-secondary text-[11px] font-medium uppercase tracking-wider">Mevcut Şifre</label>
                                        <div className="relative group">
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden md:block" />

                                    <div className="space-y-2">
                                        <label className="text-text-secondary text-[11px] font-medium uppercase tracking-wider">Yeni Şifre</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-text-secondary text-[11px] font-medium uppercase tracking-wider">Tekrar Yeni Şifre</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-3 py-2 bg-card-background border border-card-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="text-text-secondary hover:text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
                                    >
                                        {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                                        Şifreleri {showPasswords ? 'Gizle' : 'Göster'}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading || !currentPassword || !newPassword}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10"
                                    >
                                        {isPasswordLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        Şifreyi Güncelle
                                    </button>
                                </div>

                                {passwordError && (
                                    <p className="text-red-500 text-[11px] font-medium animate-in fade-in slide-in-from-top-1">{passwordError}</p>
                                )}
                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 animate-in fade-in slide-in-from-top-1">
                                        <Check size={14} />
                                        <p className="text-xs font-medium">Şifreniz başarıyla değiştirildi.</p>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-4 border-t border-card-border/50">
                            <h4 className="text-red-500 text-xs font-semibold uppercase tracking-wide mb-3">{t.settings_dangerZone}</h4>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    {t.settings_signOut}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={isDeleteLoading}
                                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {t.settings_deleteAccount}
                                </button>
                            </div>
                        </div>
                    </div>
                )

            case 'appearance':
                return (
                    <div className="space-y-6">
                        {/* Theme */}
                        <div>
                            <label className="text-foreground text-sm font-medium mb-1 block">{t.settings_theme}</label>
                            <p className="text-text-secondary text-xs mb-3">{t.settings_theme_desc}</p>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light' as const, label: t.settings_theme_light, icon: Sun },
                                    { id: 'dark' as const, label: t.settings_theme_dark, icon: Moon },
                                    { id: 'system' as const, label: t.settings_theme_system, icon: Monitor },
                                ].map((themeItem) => (
                                    <button
                                        key={themeItem.id}
                                        onClick={() => setTheme(themeItem.id)}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === themeItem.id
                                            ? 'border-button-primary-bg bg-button-primary-bg/5'
                                            : 'border-card-border/50 hover:border-card-border bg-card-background/30'
                                            }`}
                                    >
                                        <themeItem.icon size={20} className={theme === themeItem.id ? 'text-foreground' : 'text-text-secondary'} />
                                        <span className={`text-xs font-medium ${theme === themeItem.id ? 'text-foreground' : 'text-text-secondary'}`}>
                                            {themeItem.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="text-foreground text-sm font-medium mb-1 block">{t.settings_fontSize}</label>
                            <p className="text-text-secondary text-xs mb-3">{t.settings_fontSize_desc}</p>
                            <div className="flex items-center gap-2 p-1 bg-card-background rounded-lg border border-card-border/50 w-fit">
                                {([
                                    { key: 'small' as const, label: t.settings_fontSize_small },
                                    { key: 'medium' as const, label: t.settings_fontSize_medium },
                                    { key: 'large' as const, label: t.settings_fontSize_large },
                                ]).map((size) => (
                                    <button
                                        key={size.key}
                                        onClick={() => setFontSize(size.key)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${fontSize === size.key
                                            ? 'bg-button-primary-bg text-button-primary-fg shadow-sm'
                                            : 'text-text-secondary hover:text-foreground'
                                            }`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Width */}
                        <SettingRow label={t.settings_wideChat} description={t.settings_wideChat_desc}>
                            <Toggle checked={wideChat} onChange={setWideChat} />
                        </SettingRow>
                    </div>
                )

            case 'privacy':
                return (
                    <div className="space-y-6">
                        <SettingRow label={t.settings_chatHistory} description={t.settings_chatHistory_desc}>
                            <Toggle checked={chatHistory} onChange={setChatHistory} />
                        </SettingRow>

                        {/* Export Data */}
                        <div className="pt-4 border-t border-card-border/50">
                            <button
                                onClick={handleExportData}
                                className="px-4 py-2.5 bg-card-background border border-card-border rounded-lg text-foreground text-xs font-medium hover:bg-sidebar-hover transition-colors flex items-center gap-2"
                            >
                                <Download size={14} />
                                {t.settings_exportData}
                            </button>
                        </div>
                    </div>
                )

        }
    }

    return (
        <div className="flex-1 h-full flex flex-col overflow-hidden bg-background">
            {/* Settings Header */}
            <header className="w-full h-14 sm:h-16 px-4 sm:px-6 bg-background border-b border-card-border/50 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
                >
                    <ArrowLeft size={18} className="text-text-secondary" />
                </button>
                <h1 className="text-foreground text-base sm:text-lg font-semibold">{t.settings_title}</h1>
            </header>

            {/* Settings Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Settings Navigation - Horizontal tabs on mobile, vertical nav on desktop */}
                <nav className="flex-shrink-0 px-2 py-2 md:p-4 border-b md:border-b-0 md:border-r border-card-border/30 overflow-x-auto md:overflow-y-auto md:w-64">
                    <div className="flex md:flex-col gap-1 md:space-y-1 min-w-max md:min-w-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl text-left transition-all group whitespace-nowrap md:whitespace-normal md:w-full ${activeTab === tab.id
                                        ? 'bg-card-background text-foreground shadow-sm border border-card-border/50'
                                        : 'text-text-secondary hover:text-foreground hover:bg-card-background/50'
                                    }`}
                            >
                                <tab.icon size={16} className="flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-medium truncate">{tab.label}</p>
                                </div>
                                <ChevronRight
                                    size={14}
                                    className={`flex-shrink-0 transition-opacity hidden md:block ${activeTab === tab.id ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Settings Panel */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-xl px-4 py-5 sm:p-8">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-foreground text-lg sm:text-xl font-semibold">
                                {tabs.find((tabItem) => tabItem.id === activeTab)?.label}
                            </h2>
                            <p className="text-text-secondary text-xs sm:text-sm mt-1">
                                {tabs.find((tabItem) => tabItem.id === activeTab)?.description}
                            </p>
                        </div>
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Account Deletion Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isDeleteLoading && setIsDeleteModalOpen(false)}
                    />
                    <div className="relative w-full max-w-sm bg-background border border-card-border shadow-2xl rounded-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <Trash2 size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-foreground text-lg font-semibold mb-2">
                                Hesabınızı Silmek İstiyor Musunuz?
                            </h3>
                            <p className="text-text-secondary text-sm mb-6">
                                Bu işlem geri alınamaz. Tüm mesajlarınız, ayarlarınız ve verileriniz kalıcı olarak silinecektir.
                            </p>

                            <div className="w-full space-y-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleteLoading}
                                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className="animate-spin" /> : 'Kalıcı Olarak Sil'}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleteLoading}
                                    className="w-full py-2.5 bg-card-background border border-card-border hover:bg-sidebar-hover text-foreground text-sm font-medium rounded-xl transition-all"
                                >
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* Reusable Setting Row */
function SettingRow({
    label,
    description,
    children,
}: {
    label: string
    description: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-2 sm:gap-0 border-b border-card-border/30 last:border-b-0">
            <div className="flex-1 sm:mr-4">
                <p className="text-foreground text-sm font-medium">{label}</p>
                <p className="text-text-secondary text-xs mt-0.5">{description}</p>
            </div>
            {children}
        </div>
    )
}

/* Toggle Component */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-button-primary-bg' : 'bg-card-border'
                }`}
        >
            <div
                className={`absolute top-[3px] w-4 h-4 rounded-full shadow-sm transition-all duration-200 ${checked
                    ? 'left-[22px] bg-button-primary-fg'
                    : 'left-[3px] bg-white'
                    }`}
            />
        </button>
    )
}
