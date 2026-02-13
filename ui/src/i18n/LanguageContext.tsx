import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { translations, type Language, type TranslationStrings } from './translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: TranslationStrings
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'crudllm-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Language | null
        if (saved && translations[saved]) return saved
        return 'tr' // Default: Turkish
    })

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem(STORAGE_KEY, lang)
        document.documentElement.setAttribute('lang', lang)
    }, [])

    const t = translations[language]

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
