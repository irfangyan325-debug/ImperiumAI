// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        imperial: {
          black: '#1A1916',
          red: '#5A1818',
          'red-light': '#7A2828',
          'red-dark': '#3A0808',
          gold: '#A48D60',
          'gold-light': '#C4A670',
          'gold-dark': '#8A7350',
        },
      },
      fontFamily: {
        headline: ['"Cinzel"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      spacing: {
        safe: '20px',
        'safe-top': '44px',
        'safe-bottom': '34px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(164, 141, 96, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(164, 141, 96, 0.6)' },
        },
        'shimmer': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(164, 141, 96, 0.3)',
        'gold-intense': '0 0 40px rgba(164, 141, 96, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(164, 141, 96, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;