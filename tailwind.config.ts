const { fontFamily } = require('tailwindcss/defaultTheme')
const defaultTheme = require("tailwindcss/defaultTheme");

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
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lmd: "880px",
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      "2lg": "1100px",
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        'bluetiful': { DEFAULT: '#3377E2', 50: '#C2E0FF', 100: '#ADD6FF', 200: '#84C1FF', 300: '#5CADFF', 400: '#3398FF', 500: '#0A84FF', 600: '#0068D1', 700: '#004C99', 800: '#003061', 900: '#001429', 950: '#00060D' },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"]
      },
      animation: {
        fade: 'fadeOut 5s ease-in-out',
        blob: "blob 7s infinite",
    },
    },
  },
  plugins: [],
};
