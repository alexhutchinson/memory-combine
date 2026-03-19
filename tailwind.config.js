/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111111',
        'surface-2': '#1a1a1a',
        'surface-3': '#222222',
        border: '#2a2a2a',
      },
      animation: {
        'score-reveal': 'scoreReveal 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up-delayed': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-slow': 'fadeIn 0.6s ease-out 0.3s forwards',
        'number-pop': 'numberPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-gold': 'pulseGold 2.5s ease-in-out infinite',
        'gauge-fill': 'gaugeFill 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        scoreReveal: {
          '0%': { transform: 'scale(0.3) translateY(16px)', opacity: '0' },
          '60%': { transform: 'scale(1.12) translateY(-4px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        numberPop: {
          '0%': { transform: 'scale(0) rotate(-8deg)', opacity: '0' },
          '55%': { transform: 'scale(1.25) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)', borderColor: 'rgba(245, 158, 11, 0.5)' },
          '50%': { boxShadow: '0 0 32px rgba(245, 158, 11, 0.65)', borderColor: 'rgba(245, 158, 11, 0.85)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
