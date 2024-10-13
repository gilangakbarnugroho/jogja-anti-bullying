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
    // Definisi breakpoints custom
    screens: {
      "2xs": "200px",
      xs: "350px",
      s: "500px",
      sm: "640px", // Tailwind default
      md: "768px", // Tailwind default
      lmd: "880px",
      lg: "1024px", // Tailwind default
      "2lg": "1100px",
      xl: "1280px", // Tailwind default
      "2xl": "1536px", // Tailwind default
    },
    // Container centering
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
    // Custom theme extensions
    extend: {
      colors: {
        // Warna utama dengan skala yang lebih luas
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
        // Menambahkan font family dari Google Fonts
        sans: ['Plus Jakarta Sans', ...fontFamily.sans],
      },
      // Animasi custom
      animation: {
        fade: 'fadeOut 5s ease-in-out',
        blob: 'blob 7s infinite',
      },
      // Keyframes untuk animasi custom
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
      },
    },
  },
  plugins: [],
};
