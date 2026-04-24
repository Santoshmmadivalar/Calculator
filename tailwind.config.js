/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        darkBg: '#020617',
        panelBg: 'rgba(15, 23, 42, 0.4)',
        borderGlow: 'rgba(99, 102, 241, 0.3)',
        cyanGlow: '#22d3ee',
        purpleGlow: '#a855f7',
        indigoAccent: '#6366f1'
      },
      boxShadow: {
        'anti-gravity': '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
        'btn': '0 10px 15px -3px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'btn-hover': '0 0 20px rgba(34, 211, 238, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'aurora': 'aurora 15s ease infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' }
        }
      }
    },
  },
  plugins: [],
}
