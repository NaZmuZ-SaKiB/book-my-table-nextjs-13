/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "480px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    fontSize: {
      "2xsm": "10px",
      xsm: "12px",
      sm: "13px",
      reg: "15px",
      lg: "18px",
      "2xl": "22px",
      "3xl": "25px",
      "4xl": "32px",
      "5xl": "40px",
      "6xl": "50px",
      "7xl": "70px",
    },
  },
  plugins: [],
};
