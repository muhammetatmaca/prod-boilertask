import { useState } from 'react'
import AuthLayout from './AuthLayout'
import { useLanguage } from '../../i18n/LanguageContext'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { authApi } from '../../lib/auth'

interface ForgotPasswordProps {
    onBackToLogin: () => void
    onSuccess: (email: string) => void
}

export default function ForgotPassword({ onBackToLogin, onSuccess }: ForgotPasswordProps) {
    const { t } = useLanguage()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await authApi.forgotPassword(email)
            onSuccess(email) // Redirect to verify-email
        } catch (err: any) {
            setError(err.message || 'Request failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout image="/Gemini_Generated_Image_b1ex1vb1ex1vb1ex.png">
            <div className="flex flex-col h-full animate-in">
                <button
                    onClick={onBackToLogin}
                    className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors mb-8 w-fit group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">{t.auth_backToLogin}</span>
                </button>

                <div className="flex flex-col gap-1 mb-10">
                    <h1 className="text-black text-3xl font-medium mb-2">{t.auth_resetPassword}</h1>
                    <p className="text-neutral-500 text-sm font-light max-w-sm">
                        Enter your email address and we'll send you a code to reset your password.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-8" onSubmit={handleForgot}>
                    <div className="space-y-4">
                        <label className="text-black text-base font-normal ml-1">
                            {t.auth_emailAddress}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full h-14 px-7 bg-white rounded-md border-[0.60px] border-zinc-800 focus:border-emerald-600 outline-none transition-all text-sm font-light text-zinc-600 placeholder:text-neutral-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white text-base font-medium rounded-md transition-all transform active:scale-[0.99] disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.auth_resetPassword}
                    </button>
                </form>
            </div>
        </AuthLayout>
    )
}
