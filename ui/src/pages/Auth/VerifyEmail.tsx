import { useState } from 'react'
import AuthLayout from './AuthLayout'
import { useLanguage } from '../../i18n/LanguageContext'
import { Loader2 } from 'lucide-react'
import { authApi } from '../../lib/auth'

interface VerifyEmailProps {
    onSuccess: (token?: string) => void
    onResend: () => void
    resendStatus: 'idle' | 'loading' | 'success' | 'error'
    mode?: 'email' | 'reset'
}

export default function VerifyEmail({ onSuccess, onResend, resendStatus, mode = 'email' }: VerifyEmailProps) {
    const { t } = useLanguage()
    const [token, setToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (mode === 'email') {
                await authApi.verifyEmail(token)
            } else {
                await authApi.verifyResetToken(token)
            }
            onSuccess(token)
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please check your code.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout image="/Gemini_Generated_Image_b1ex1vb1ex1vb1ex.png">
            <div className="flex flex-col h-full items-center text-center animate-in">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-8">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                    </svg>
                </div>

                <h1 className="text-black text-3xl font-medium mb-4">
                    {mode === 'email' ? t.auth_verifyEmail : 'Kodu Onayla'}
                </h1>
                <p className="text-neutral-500 text-sm font-light mb-8 max-w-xs leading-relaxed">
                    {mode === 'email'
                        ? t.auth_verifyInstruction
                        : 'Şifrenizi sıfırlamak için e-postanıza gönderdiğimiz 6 haneli kodu aşağıya girin.'}
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Resend Status */}
                {resendStatus === 'success' && (
                    <div className="mb-4 w-full p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-600 text-sm">
                        Doğrulama kodu e-postanıza gönderildi!
                    </div>
                )}
                {resendStatus === 'error' && (
                    <div className="mb-4 w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleVerify}>
                    <div className="space-y-3 text-left">
                        <label className="text-black text-base font-normal block ml-1">
                            {t.auth_verifyCode}
                        </label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter verification code"
                            required
                            className="w-full h-14 px-7 bg-white rounded-md border-[0.60px] border-zinc-800 focus:border-emerald-600 outline-none transition-all text-sm font-light text-zinc-600 placeholder:text-neutral-400 text-center tracking-widest font-mono text-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white text-base font-medium rounded-md transition-all transform active:scale-[0.99] disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            mode === 'email' ? t.auth_verifyEmail : 'Kodu Onayla'
                        )}
                    </button>
                </form>

                <p className="text-neutral-500 text-sm font-light mt-8 flex items-center gap-2">
                    Didn't receive the code?{' '}
                    <button
                        onClick={onResend}
                        disabled={resendStatus === 'loading'}
                        className="text-black font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {resendStatus === 'loading' ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            t.auth_resendCode
                        )}
                    </button>
                </p>
            </div>
        </AuthLayout>
    )
}
