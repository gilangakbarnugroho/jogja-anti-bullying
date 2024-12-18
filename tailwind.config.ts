const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      "2xs": "200px",
      xs: "350px",
      s: "500px",
      sm: "640px", 
      md: "768px", 
      lmd: "880px",
      lg: "1024px", 
      "2lg": "1100px",
      xl: "1280px", 
      "2xl": "1536px", 
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        bluetiful: {
          DEFAULT: '#3377E2',
          50: '#C2E0FF',
          100: '#ADD6FF',
          200: '#84C1FF',
          300: '#5CADFF',
          400: '#3398FF',
          500: '#0A84FF',
          600: '#0068D1',
          700: '#004C99',
          800: '#003061',
          900: '#001429',
          950: '#00060D',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', ...fontFamily.sans],
      },
      animation: {
        fade: 'fadeOut 5s ease-in-out',
        blob: 'blob 7s infinite',
        infinitescroll: 'infinite-scroll 25s linear infinites',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        blob: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        infinitescroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }                  
      },
    },
  },
  plugins: [],
};
