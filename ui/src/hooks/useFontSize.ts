import { useState, useEffect, useCallback } from 'react'

export type FontSize = 'small' | 'medium' | 'large'

export function useFontSize() {
    const [fontSize, setFontSizeState] = useState<FontSize>(() => {
        const saved = localStorage.getItem('crudllm-font-size') as FontSize | null
        return saved || 'medium'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize)
        localStorage.setItem('crudllm-font-size', fontSize)
    }, [fontSize])

    const setFontSize = useCallback((size: FontSize) => {
        setFontSizeState(size)
    }, [])

    return { fontSize, setFontSize }
}
