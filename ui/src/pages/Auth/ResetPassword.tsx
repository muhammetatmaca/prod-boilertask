import { useState } from 'react'
import AuthLayout from './AuthLayout'
import { useLanguage } from '../../i18n/LanguageContext'
import { ArrowLeft, Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { authApi } from '../../lib/auth'

interface ResetPasswordProps {
    token: string
    onSuccess: () => void
    onBack: () => void
}

export default function ResetPassword({ token, onSuccess, onBack }: ResetPasswordProps) {
    const { t } = useLanguage()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isFinished, setIsFinished] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor')
            return
        }
        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await authApi.resetPassword(token, password)
            setIsFinished(true)
            setTimeout(() => onSuccess(), 2000)
        } catch (err: any) {
            setError(err.message || 'Şifre güncellenemedi. Kod geçersiz veya süresi dolmuş olabilir.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isFinished) {
        return (
            <AuthLayout image="/Gemini_Generated_Image_b1ex1vb1ex1vb1ex.png">
                <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                        <Check size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-black mb-2">Şifre Güncellendi!</h1>
                    <p className="text-neutral-500 mb-8 max-w-xs">Şifreniz başarıyla değiştirildi. Giriş ekranına yönlendiriliyorsunuz...</p>
                    <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-progress origin-left" />
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout image="/Gemini_Generated_Image_b1ex1vb1ex1vb1ex.png">
            <div className="flex flex-col h-full animate-in">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors mb-8 w-fit group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">{t.common_cancel || 'Vazgeç'}</span>
                </button>

                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-black text-3xl font-medium mb-2">{t.auth_resetPassword}</h1>
                    <p className="text-neutral-500 text-sm font-light max-w-sm">
                        Lütfen hesabınız için yeni ve güvenli bir şifre belirleyin.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleReset}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-black text-sm font-medium ml-1">{t.auth_password}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 px-6 bg-white rounded-xl border border-zinc-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-light"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-black text-sm font-medium ml-1">{t.auth_confirmPassword}</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 px-6 bg-white rounded-xl border border-zinc-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-light"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white text-base font-semibold rounded-xl transition-all shadow-xl shadow-black/10 transform active:scale-[0.98] disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.auth_resetPassword}
                    </button>
                </form>
            </div>
        </AuthLayout>
    )
}
