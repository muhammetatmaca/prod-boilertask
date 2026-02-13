import { useState } from 'react'
import AuthLayout from './AuthLayout'
import { useLanguage } from '../../i18n/LanguageContext'
import { Loader2 } from 'lucide-react'
import { authApi } from '../../lib/auth'

interface SignUpProps {
    onSignInClick: () => void
    onSuccess: (email: string) => void
}

export default function SignUp({ onSignInClick, onSuccess }: SignUpProps) {
    const { t } = useLanguage()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await authApi.register(email, password)
            onSuccess(email) // Redirect to verify-email
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout image="/Gemini_Generated_Image_xsecf0xsecf0xsec.png">
            <div className="flex flex-col h-full animate-in">
                {/* Header */}
                <div className="mb-2">
                    <p className="text-black text-2xl font-light">{t.auth_welcome} !</p>
                </div>

                <div className="mb-4">
                    <h1 className="text-black text-3xl font-medium">{t.auth_signUp} to</h1>
                    <p className="text-black text-base font-normal opacity-60">Join the CrudLLM community</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-3 mt-4" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <label className="text-black text-base font-normal block ml-1">
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

                    <div className="space-y-2">
                        <label className="text-black text-base font-normal block ml-1">
                            {t.auth_password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full h-14 px-7 bg-white rounded-md border-[0.60px] border-zinc-800 focus:border-emerald-600 outline-none transition-all text-sm font-light text-zinc-600 placeholder:text-neutral-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black hover:bg-zinc-800 text-white text-base font-medium rounded-md transition-all transform active:scale-[0.99] mt-2 disabled:bg-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-auto pt-6 text-center">
                    <p className="text-zinc-500 text-base font-light">
                        {t.auth_hasAccount}
                        <button
                            onClick={onSignInClick}
                            className="text-black font-semibold ml-2 hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    )
}
