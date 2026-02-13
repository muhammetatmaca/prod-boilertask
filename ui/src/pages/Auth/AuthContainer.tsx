import { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import VerifyEmail from './VerifyEmail'
import ResetPassword from './ResetPassword'
import { authApi, type User } from '../../lib/auth'

type AuthView = 'signin' | 'signup' | 'forgot' | 'verify' | 'reset-password'

interface AuthContainerProps {
    onLoginSuccess: (user: User) => void
}

export default function AuthContainer({ onLoginSuccess }: AuthContainerProps) {
    const [view, setView] = useState<AuthView>('signin')
    const [email, setEmail] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [verifyMode, setVerifyMode] = useState<'email' | 'reset'>('email')
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleResend = async () => {
        if (!email) return
        setResendStatus('loading')
        try {
            await authApi.resendVerification(email)
            setResendStatus('success')
            setTimeout(() => setResendStatus('idle'), 3000)
        } catch (err) {
            setResendStatus('error')
            setTimeout(() => setResendStatus('idle'), 3000)
        }
    }

    const handleVerifySuccess = (token?: string) => {
        if (verifyMode === 'reset' && token) {
            setResetToken(token)
            setView('reset-password')
        } else {
            setView('signin')
        }
    }

    switch (view) {
        case 'signin':
            return (
                <SignIn
                    onSignUpClick={() => setView('signup')}
                    onForgotClick={() => setView('forgot')}
                    onSuccess={(user) => onLoginSuccess(user)}
                />
            )
        case 'signup':
            return (
                <SignUp
                    onSignInClick={() => setView('signin')}
                    onSuccess={(userEmail: string) => {
                        setEmail(userEmail)
                        setVerifyMode('email')
                        setView('verify')
                    }}
                />
            )
        case 'forgot':
            return (
                <ForgotPassword
                    onBackToLogin={() => setView('signin')}
                    onSuccess={(userEmail: string) => {
                        setEmail(userEmail)
                        setVerifyMode('reset')
                        setView('verify')
                    }}
                />
            )
        case 'verify':
            return (
                <VerifyEmail
                    onSuccess={handleVerifySuccess}
                    onResend={handleResend}
                    resendStatus={resendStatus}
                    mode={verifyMode}
                />
            )
        case 'reset-password':
            return (
                <ResetPassword
                    token={resetToken}
                    onSuccess={() => setView('signin')}
                    onBack={() => setView('signin')}
                />
            )
        default:
            return <SignIn onSignUpClick={() => setView('signup')} onForgotClick={() => setView('forgot')} onSuccess={onLoginSuccess} />
    }
}
