import { useState } from 'react'
import type { Message } from '../lib/chat'
import { useLanguage } from '../i18n/LanguageContext'

interface MessageBubbleProps {
    message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user'

    if (isUser) {
        return (
            <div className="flex w-full justify-end animate-in">
                <div className="flex items-start gap-2 sm:gap-3 flex-row-reverse max-w-[85%] sm:max-w-[70%]">
                    {/* User Avatar */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] sm:text-[10px] font-bold mt-0.5 bg-slate-700 text-white shadow-sm border border-white/5">
                        S
                    </div>
                    {/* User Message Bubble */}
                    <div className="flex flex-col items-end">
                        <div className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl rounded-tr-md bg-button-primary-bg text-button-primary-fg text-[13px] sm:text-sm leading-relaxed">
                            {message.content}
                        </div>
                        <span className="text-[10px] text-text-placeholder mt-1 px-1">
                            {formatTime(message.timestamp)}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // Assistant message — open layout, no box
    return (
        <div className="w-full animate-in">
            {/* Avatar + Thinking label */}
            <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <ThinkingLabel />
            </div>

            {/* Message Content — open, no box */}
            <div className="pl-[34px] sm:pl-[38px] text-foreground text-[14px] sm:text-[15px] leading-6 sm:leading-7">
                <AssistantContent content={message.content} />
            </div>
        </div>
    )
}

/* Typing indicator */
export function TypingIndicator() {
    return (
        <div className="w-full animate-in">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card-background/60">
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* "Thought for X seconds" label with timer */
function ThinkingLabel() {
    const [seconds] = useState(() => Math.floor(3 + Math.random() * 10))
    const { t, language } = useLanguage()

    // For Turkish: "5 saniye düşündü", for English: "Thought for 5 seconds"
    const label = language === 'tr'
        ? `${seconds} ${t.msg_thoughtFor}`
        : language === 'de'
            ? `${t.msg_thoughtFor} ${seconds} ${t.msg_seconds}`
            : `${t.msg_thoughtFor} ${seconds} ${t.msg_seconds}`

    return (
        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
            <ThinkingIcon />
            <span>{label}</span>
        </div>
    )
}

function ThinkingIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-secondary">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
            <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/* Renders assistant content with proper markdown-like formatting */
function AssistantContent({ content }: { content: string }) {
    const blocks = parseBlocks(content)

    return (
        <div className="space-y-1">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case 'paragraph':
                        return (
                            <p key={i} className="mb-4">
                                {processInline(block.content)}
                            </p>
                        )
                    case 'heading':
                        return (
                            <div key={i}>
                                {i > 0 && <hr className="border-card-border/40 my-6" />}
                                <h3 className="text-xl font-normal font-playfair mt-2 mb-3 text-foreground">
                                    {processInline(block.content)}
                                </h3>
                            </div>
                        )
                    case 'bullet':
                        return (
                            <div key={i} className="flex items-start gap-2.5 py-1 pl-2">
                                <span className="text-text-secondary mt-2.5 w-1.5 h-1.5 rounded-full bg-text-secondary/70 flex-shrink-0" />
                                <span className="flex-1">{processInline(block.content)}</span>
                            </div>
                        )
                    case 'numbered':
                        return (
                            <div key={i} className="flex items-start gap-2.5 py-1 pl-2">
                                <span className="text-text-secondary font-medium min-w-[18px] flex-shrink-0">
                                    {block.number}.
                                </span>
                                <span className="flex-1">{processInline(block.content)}</span>
                            </div>
                        )
                    case 'blockquote':
                        return (
                            <blockquote key={i} className="border-l-2 border-text-secondary/25 pl-4 py-1 my-3 italic text-text-secondary">
                                {processInline(block.content)}
                            </blockquote>
                        )
                    case 'divider':
                        return <hr key={i} className="border-card-border/40 my-6" />
                    case 'code':
                        return (
                            <pre key={i} className="bg-card-background rounded-lg px-4 py-3 my-3 text-sm font-mono text-foreground overflow-x-auto">
                                {block.content}
                            </pre>
                        )
                    case 'table':
                        return (
                            <div key={i} className="bg-card-background/50 rounded-lg px-4 py-3 my-3 text-sm font-mono text-text-secondary overflow-x-auto">
                                {block.content}
                            </div>
                        )
                    case 'empty':
                        return <div key={i} className="h-1" />
                    default:
                        return <p key={i}>{processInline(block.content)}</p>
                }
            })}
        </div>
    )
}

/* Block types */
interface Block {
    type: 'paragraph' | 'heading' | 'bullet' | 'numbered' | 'blockquote' | 'divider' | 'code' | 'table' | 'empty'
    content: string
    number?: number
}

function parseBlocks(content: string): Block[] {
    const lines = content.split('\n')
    const blocks: Block[] = []
    let inCodeBlock = false
    let codeContent = ''

    for (const line of lines) {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                blocks.push({ type: 'code', content: codeContent.trim() })
                codeContent = ''
                inCodeBlock = false
            } else {
                inCodeBlock = true
            }
            continue
        }

        if (inCodeBlock) {
            codeContent += line + '\n'
            continue
        }

        if (line === '') {
            blocks.push({ type: 'empty', content: '' })
        } else if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
            const content = line.replace(/^#{1,3}\s/, '')
            blocks.push({ type: 'heading', content })
        } else if (line.startsWith('**Step') || line.startsWith('**Option') || line.startsWith('**Day')) {
            // Treat bold-starting lines as headings
            blocks.push({ type: 'heading', content: line })
        } else if (line.startsWith('> ')) {
            blocks.push({ type: 'blockquote', content: line.slice(2) })
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            blocks.push({ type: 'bullet', content: line.slice(2) })
        } else if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+)\.\s(.+)/)
            if (match) {
                blocks.push({ type: 'numbered', content: match[2], number: parseInt(match[1]) })
            }
        } else if (line.startsWith('| ') && line.endsWith(' |')) {
            blocks.push({ type: 'table', content: line })
        } else if (line === '---') {
            blocks.push({ type: 'divider', content: '' })
        } else {
            blocks.push({ type: 'paragraph', content: line })
        }
    }

    return blocks
}

/* Inline formatting: **bold**, *italic*, `code` */
function processInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
        // Bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
        const codeMatch = remaining.match(/`(.+?)`/)
        const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)

        let first: { match: RegExpMatchArray; type: string } | null = null

        for (const [type, m] of [['bold', boldMatch], ['code', codeMatch], ['italic', italicMatch]] as const) {
            if (m && m.index !== undefined) {
                if (!first || m.index < (first.match.index ?? Infinity)) {
                    first = { match: m as RegExpMatchArray, type }
                }
            }
        }

        if (first && first.match.index !== undefined) {
            const before = remaining.slice(0, first.match.index)
            if (before) parts.push(before)

            if (first.type === 'bold') {
                parts.push(<strong key={key++} className="font-semibold text-foreground">{first.match[1]}</strong>)
            } else if (first.type === 'code') {
                parts.push(
                    <code key={key++} className="px-1.5 py-0.5 bg-card-background border border-card-border/50 rounded text-[13px] font-mono text-foreground">
                        {first.match[1]}
                    </code>
                )
            } else if (first.type === 'italic') {
                parts.push(<em key={key++} className="italic">{first.match[1]}</em>)
            }

            remaining = remaining.slice(first.match.index + first.match[0].length)
        } else {
            parts.push(remaining)
            break
        }
    }

    return <>{parts}</>
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}
