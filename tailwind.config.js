/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        arabic: ['"Noto Kufi Arabic Variable"', 'sans-serif'],
      },
      colors: {
        accent: {
          100: '#5ef6a2',
          200: '#38ca79',
          300: '#2fb86b',
          400: '#26a65c',
          500: '#1d8f4d',
          600: '#14783e',
          700: '#0b612f',
          800: '#024a20',
        },
      },
    },
  },
  plugins: [],
}
