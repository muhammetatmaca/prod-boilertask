import { useState, useEffect, useCallback } from 'react'
import Sidebar, { type PageView } from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Settings from './components/Settings'
import AuthContainer from './pages/Auth/AuthContainer'
import { useTheme, type Theme } from './hooks/useTheme'
import { useFontSize, type FontSize } from './hooks/useFontSize'
import { useLanguage } from './i18n/LanguageContext'
import { type Language } from './i18n/translations'
import { useWideChat } from './hooks/useWideChat'
import { authStorage, authApi, type User } from './lib/auth'
import { chatApi, type Chat } from './lib/chat-api'

function App() {
  // Start with sidebar closed on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activePage, setActivePage] = useState<PageView>('chat')
  const [isLoginWarningOpen, setIsLoginWarningOpen] = useState(false)
  const [showAuthScreen, setShowAuthScreen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'general' | 'profile'>('general')
  const { theme, toggleTheme, setTheme } = useTheme()
  const { fontSize, setFontSize } = useFontSize()
  const { wideChat, setWideChat } = useWideChat()
  const { setLanguage } = useLanguage()

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])

  const loadChats = useCallback(async () => {
    const token = authStorage.getAccessToken()
    if (token) {
      try {
        const userChats = await chatApi.getUserChats(token)
        setChats(userChats)
      } catch (error) {
        console.error('Failed to load chats:', error)
      }
    }
  }, [])

  useEffect(() => {
    const token = authStorage.getAccessToken()
    if (token) {
      // Fetch user profile if token exists
      authApi.me(token).then(userData => {
        setUser(userData)
        // Sync preferences
        if (userData.preferences) {
          const { theme: pTheme, font_size, language: pLang, wide_chat } = userData.preferences
          if (pTheme) setTheme(pTheme as Theme)
          if (font_size) setFontSize(font_size as FontSize)
          if (pLang) setLanguage(pLang as Language)
          if (wide_chat !== undefined) setWideChat(wide_chat)
        }
        loadChats(); // Load chats after auth
      }).catch(() => {
        authStorage.clearTokens()
        setUser(null)
      })
    }
  }, [setTheme, setFontSize, setLanguage, setWideChat, loadChats])

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
    setShowAuthScreen(false)
    setIsLoginWarningOpen(false)
    loadChats()
  }

  const handleLogout = () => {
    authStorage.clearTokens()
    setUser(null)
    setActivePage('chat')
    setChats([])
    setActiveChatId(null)
  }

  const handleNavigateProfile = () => {
    setSettingsTab('profile')
    setActivePage('settings')
  }

  const handleChatCreated = (newChatId: string) => {
    loadChats();
    setActiveChatId(newChatId);
  }

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setActivePage('chat');
  }

  const handleNewChat = () => {
    setActiveChatId(null);
    setActivePage('chat');
  }

  const handleDeleteChat = async (chatId: string) => {
    const token = authStorage.getAccessToken();
    if (!token) return;
    try {
      await chatApi.deleteChat(token, chatId);
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }

  // If showAuthScreen is true, we display the full login view
  if (showAuthScreen && !user) {
    return (
      <div className="h-screen w-screen bg-background relative overflow-auto">
        {/* Back to Chat button for guests who change their mind */}
        <button
          onClick={() => setShowAuthScreen(false)}
          className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[200] flex items-center gap-2 px-3 py-2 sm:px-4 bg-white/80 backdrop-blur-md hover:bg-white rounded-xl text-black text-sm font-semibold transition-all shadow-xl border border-zinc-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hidden sm:inline">Sohbete Geri Dön</span>
        </button>
        <AuthContainer onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }

  const userDisplayName = user ? user.email.split('@')[0] : 'Misafir'

  const renderPage = () => {
    switch (activePage) {
      case 'chat':
        return (
          <ChatArea
            userName={userDisplayName}
            theme={theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme as 'light' | 'dark'}
            onToggleTheme={toggleTheme}
            user={user}
            onAuthRequired={() => setIsLoginWarningOpen(true)}
            onNavigateProfile={handleNavigateProfile}
            onLogout={handleLogout}
            chatId={activeChatId}
            onChatCreated={handleChatCreated}
            onOpenSidebar={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
        )
      case 'settings':
        return (
          <Settings
            user={user}
            initialTab={settingsTab}
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            wideChat={wideChat}
            setWideChat={setWideChat}
            onBack={() => {
              setActivePage('chat')
              setSettingsTab('general')
            }}
            onLogout={handleLogout}
          />
        )
      case 'search':
        return (
          <div className="flex-1 h-full flex flex-col">
            <ChatArea
              userName={userDisplayName}
              theme={theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme as 'light' | 'dark'}
              onToggleTheme={toggleTheme}
              user={user}
              onAuthRequired={() => setIsLoginWarningOpen(true)}
              onNavigateProfile={handleNavigateProfile}
              onLogout={handleLogout}
              chatId={activeChatId}
              onChatCreated={handleChatCreated}
              onOpenSidebar={() => setSidebarOpen(true)}
              sidebarOpen={sidebarOpen}
            />
          </div>
        )
      default:
        return (
          <ChatArea
            userName={userDisplayName}
            theme={theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme as 'light' | 'dark'}
            onToggleTheme={toggleTheme}
            user={user}
            onAuthRequired={() => setIsLoginWarningOpen(true)}
            onNavigateProfile={handleNavigateProfile}
            onLogout={handleLogout}
            chatId={activeChatId}
            onChatCreated={handleChatCreated}
            onOpenSidebar={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
        )
    }
  }

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden relative">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogin={() => setShowAuthScreen(true)}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        chats={chats}
      />
      {renderPage()}

      {/* Login Warning Modal */}
      {isLoginWarningOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card-background border border-card-border p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col items-center text-center gap-5 sm:gap-6 transform animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center text-teal-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground text-lg sm:text-xl font-bold">Giriş Yapmanız Gerekiyor</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Yapay zeka modellerimizle mesajlaşabilmek için bir hesaba ihtiyacınız var. Hemen giriş yapın veya ücretsiz bir hesap oluşturun.
              </p>
            </div>

            <div className="flex w-full gap-3 mt-2">
              <button
                onClick={() => setIsLoginWarningOpen(false)}
                className="flex-1 px-4 py-3 border border-card-border hover:bg-sidebar-hover text-foreground text-sm font-semibold rounded-2xl transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setIsLoginWarningOpen(false)
                  setShowAuthScreen(true)
                }}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-900/20"
              >
                Girişe Git
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
