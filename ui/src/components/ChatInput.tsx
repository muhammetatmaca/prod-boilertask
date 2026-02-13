import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Mic } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

interface ChatInputProps {
    onSend: (message: string) => void
    disabled?: boolean
    prefillText?: string
    onPrefillConsumed?: () => void
}

export default function ChatInput({ onSend, disabled = false, prefillText, onPrefillConsumed }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { t } = useLanguage()

    // When prefillText changes, fill it into the input and focus
    useEffect(() => {
        if (prefillText) {
            setMessage(prefillText)
            onPrefillConsumed?.()
            // Focus and move cursor to end
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus()
                    textareaRef.current.selectionStart = prefillText.length
                    textareaRef.current.selectionEnd = prefillText.length
                }
            }, 50)
        }
    }, [prefillText])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
        }
    }, [message])

    const handleSend = () => {
        const trimmed = message.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setMessage('')
    }

    return (
        <div className="w-full" style={{ maxWidth: 'var(--chat-max-width)' }}>
            <div className="w-full px-3 py-3 sm:px-5 sm:py-4 bg-card-background/50 rounded-xl sm:rounded-2xl shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-card-border/60 backdrop-blur-2xl flex flex-col gap-2 sm:gap-3">
                {/* Input Area */}
                <div className="w-full flex flex-col gap-2 sm:gap-3">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.chatInput_placeholder}
                        rows={1}
                        disabled={disabled}
                        className="w-full bg-transparent text-foreground text-sm font-normal font-inter placeholder:text-card-text-placeholder resize-none outline-none leading-5 min-h-[20px] max-h-[160px] disabled:opacity-50"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />

                    {/* Bottom toolbar */}
                    <div className="w-full flex items-center justify-end">
                        <div className="flex items-center gap-3">
                            {/* Mic button */}
                            <button className="p-1.5 rounded-md hover:bg-sidebar-hover transition-colors flex items-center justify-center">
                                <Mic size={16} className="text-button-primary-bg" />
                            </button>

                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || disabled}
                                className={`p-1.5 rounded-md flex items-center justify-center transition-all ${message.trim() && !disabled
                                    ? 'bg-button-primary-bg hover:opacity-90 cursor-pointer'
                                    : 'bg-button-primary-bg/50 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <ArrowUp size={18} className="text-button-primary-fg" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
