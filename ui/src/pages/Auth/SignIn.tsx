import { useState } from 'react'
import AuthLayout from './AuthLayout'
import { useLanguage } from '../../i18n/LanguageContext'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authApi, authStorage } from '../../lib/auth'

interface SignInProps {
    onSignUpClick: () => void
    onForgotClick: () => void
    onSuccess: (user: any) => void
}

export default function SignIn({ onSignUpClick, onForgotClick, onSuccess }: SignInProps) {
    const { t } = useLanguage()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await authApi.login(email, password)
            authStorage.setTokens(response.access_token, response.refresh_token)
            onSuccess(response.user)
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout image="/Gemini_Generated_Image_b1ex1vb1ex1vb1ex.png">
            <div className="flex flex-col h-full animate-in">
                {/* Welcome Message */}
                <div className="mb-2">
                    <p className="text-black text-2xl font-light">{t.auth_welcome} !</p>
                </div>

                <div className="mb-4">
                    <h1 className="text-black text-3xl font-medium">{t.auth_signIn} to</h1>
                    <p className="text-black text-base font-normal opacity-60">CrudLLM is simply powerful</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-5 mt-4" onSubmit={handleLogin}>
                    <div className="space-y-3">
                        <label className="text-black text-base font-normal block">
                            {t.auth_emailAddress}
                        </label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full h-14 px-7 bg-white rounded-md border-[0.60px] border-zinc-800 focus:border-emerald-600 outline-none transition-all text-sm font-light text-zinc-600 placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-black text-base font-normal block">
                            {t.auth_password}
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full h-14 px-7 bg-white rounded-md border-[0.60px] border-zinc-800 focus:border-emerald-600 outline-none transition-all text-sm font-light text-zinc-600 placeholder:text-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-700 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between items-center px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center transition-colors ${rememberMe ? 'bg-black' : 'bg-white'}`}
                                onClick={() => setRememberMe(!rememberMe)}
                            >
                                {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="text-black text-xs font-light group-hover:opacity-70">{t.auth_rememberMe}</span>
                        </label>
                        <button
                            type="button"
                            onClick={onForgotClick}
                            className="text-neutral-600 text-xs font-light hover:text-black hover:underline"
                        >
                            {t.auth_forgotPassword} ?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white text-base font-medium rounded-md transition-all transform active:scale-[0.99] shadow-lg shadow-black/5 disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-auto pt-6 text-center">
                    <p className="text-zinc-500 text-base font-light">
                        {t.auth_noAccount}
                        <button
                            onClick={onSignUpClick}
                            className="text-black font-semibold ml-2 hover:underline"
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    )
}
