/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        geist: ['Geist', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'text-secondary': 'var(--text-secondary)',
        'text-placeholder': 'var(--text-placeholder)',
        card: {
          background: 'var(--card-background)',
          foreground: 'var(--card-foreground)',
          border: 'var(--card-border)',
          'text-placeholder': 'var(--card-text-placeholder)',
        },
        button: {
          'primary-bg': 'var(--button-primary-background)',
          'primary-fg': 'var(--button-primary-foreground)',
          'secondary-bg': 'var(--button-secondary-background)',
        },
        sidebar: {
          bg: 'var(--sidebar-background)',
          border: 'var(--sidebar-border)',
          hover: 'var(--sidebar-hover)',
          active: 'var(--sidebar-active)',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
