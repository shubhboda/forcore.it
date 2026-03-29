/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        space: '#0a0a0f',
        'space-light': '#0d0d1a',
        cyan: {
          DEFAULT: '#00d4ff',
          glow: 'rgba(0, 212, 255, 0.4)',
        },
        blue: {
          DEFAULT: '#0066ff',
          glow: 'rgba(0, 102, 255, 0.3)',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
        },
      },
    },
  },
  plugins: [],
};
