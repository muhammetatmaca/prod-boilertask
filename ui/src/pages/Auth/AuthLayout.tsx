import type { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
    image?: string
}

export default function AuthLayout({ children, image }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-white relative font-poppins overflow-x-hidden">
            {/* Logo in Top Left */}
            <div className="absolute left-4 top-4 sm:left-[42px] sm:top-[31px] z-50 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-black text-lg sm:text-xl font-semibold tracking-tight">CrudLLM</span>
            </div>

            <div className="w-full h-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:justify-start lg:px-[111px] py-16 sm:py-10 relative">
                {/* Form Card */}
                <div className="w-full max-w-[505px] bg-white rounded-[10px] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-zinc-500 relative z-10 flex flex-col p-6 sm:p-8 md:p-10">
                    {children}
                </div>

                {/* Right Side Illustration - Hidden on mobile and tablet */}
                <div className="hidden lg:block absolute left-[650px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt="Auth Illustration"
                            className="w-full h-full object-contain mix-blend-multiply opacity-90 animate-in"
                            style={{ animationDelay: '0.2s' }}
                        />
                    ) : (
                        <div className="w-full h-full bg-stone-50 rounded-full flex items-center justify-center border border-dashed border-zinc-200">
                            <p className="text-zinc-300">Illustration Placeholder</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Accent for mobile */}
            <div className="lg:hidden absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10" />
        </div>
    )
}
