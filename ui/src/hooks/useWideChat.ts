import { useState, useEffect, useCallback } from 'react'

export function useWideChat() {
    const [wideChat, setWideChatState] = useState<boolean>(() => {
        const saved = localStorage.getItem('crudllm-wide-chat')
        return saved === 'true'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-wide-chat', wideChat.toString())
        localStorage.setItem('crudllm-wide-chat', wideChat.toString())
    }, [wideChat])

    const setWideChat = useCallback((wide: boolean) => {
        setWideChatState(wide)
    }, [])

    return { wideChat, setWideChat }
}
