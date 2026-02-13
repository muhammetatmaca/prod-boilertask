import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('crudllm-theme') as Theme | null
        return saved || 'light'
    })

    const applyTheme = useCallback((t: Theme) => {
        let effectiveTheme: 'light' | 'dark' = 'light'

        if (t === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            effectiveTheme = t
        }

        document.documentElement.setAttribute('data-theme', effectiveTheme)
        if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem('crudllm-theme', theme)

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => applyTheme('system')
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [theme, applyTheme])

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, [])

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t)
    }, [])

    return { theme, toggleTheme, setTheme }
}
