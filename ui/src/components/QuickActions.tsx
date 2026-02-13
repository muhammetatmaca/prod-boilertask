import {
    BookOpen,
    Hammer,
    Lightbulb,
    Search,
    Sparkles,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

interface QuickActionsProps {
    onAction: (prompt: string) => void
    disabled?: boolean
}

export default function QuickActions({ onAction, disabled = false }: QuickActionsProps) {
    const { t } = useLanguage()

    const actions = [
        {
            icon: BookOpen,
            label: t.quick_learn,
            prompt: t.quick_learn_prompt,
            gradient: 'from-blue-500/10 to-cyan-500/10',
            hoverGradient: 'hover:from-blue-500/20 hover:to-cyan-500/20',
            iconColor: 'text-blue-500',
            borderColor: 'hover:border-blue-500/30',
        },
        {
            icon: Hammer,
            label: t.quick_build,
            prompt: t.quick_build_prompt,
            gradient: 'from-orange-500/10 to-amber-500/10',
            hoverGradient: 'hover:from-orange-500/20 hover:to-amber-500/20',
            iconColor: 'text-orange-500',
            borderColor: 'hover:border-orange-500/30',
        },
        {
            icon: Lightbulb,
            label: t.quick_getAdvice,
            prompt: t.quick_getAdvice_prompt,
            gradient: 'from-yellow-500/10 to-lime-500/10',
            hoverGradient: 'hover:from-yellow-500/20 hover:to-lime-500/20',
            iconColor: 'text-yellow-500',
            borderColor: 'hover:border-yellow-500/30',
        },
        {
            icon: Search,
            label: t.quick_research,
            prompt: t.quick_research_prompt,
            gradient: 'from-emerald-500/10 to-teal-500/10',
            hoverGradient: 'hover:from-emerald-500/20 hover:to-teal-500/20',
            iconColor: 'text-emerald-500',
            borderColor: 'hover:border-emerald-500/30',
        },
    ]

    return (
        <div className="w-full max-w-[640px] grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 px-2 sm:px-0">
            {actions.map((action) => (
                <button
                    key={action.label}
                    disabled={disabled}
                    onClick={() => onAction(action.prompt)}
                    className={`
                        group relative px-3 py-3 sm:px-4 sm:py-3.5
                        bg-gradient-to-br ${action.gradient} ${action.hoverGradient}
                        rounded-xl sm:rounded-2xl backdrop-blur-2xl
                        flex items-center justify-center gap-1.5 sm:gap-2
                        border border-card-border/40 ${action.borderColor}
                        transition-all duration-300 ease-out
                        hover:shadow-lg hover:shadow-black/5
                        hover:scale-[1.03] active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                >
                    <action.icon
                        size={15}
                        className={`${action.iconColor} transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                    />
                    <span className="text-foreground text-[11px] sm:text-[13px] font-semibold leading-4 whitespace-nowrap">
                        {action.label}
                    </span>
                    <Sparkles
                        size={10}
                        className="absolute top-1.5 right-2 text-foreground/0 group-hover:text-foreground/30 transition-all duration-500"
                    />
                </button>
            ))}
        </div>
    )
}
