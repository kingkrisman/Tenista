/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0D',
        smoke: '#F2F2F0',
        bone: '#E8E8E4',
        court: {
          50: '#EAF2FD',
          200: '#A9C9F2',
          400: '#4D8FE0',
          500: '#2F7DD8',
          600: '#1D63C8',
          700: '#14489B',
          900: '#0A2A63',
        },
        ball: '#D8F24B',
        clay: '#C1663C',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.055em',
        supertight: '-0.07em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        swift: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
      },
    },
  },
  plugins: [],
}
