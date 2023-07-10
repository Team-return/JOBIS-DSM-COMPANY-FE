/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, ts, tsx, jsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "465px",
      md: "768px",
      lg: "1024px",
      xl: "1640px",
    },
    colors: {
      bgColor: "#FAFAFA",
      black: "#0000000",
      white: "#ffffff",
      Main500: "#0F4C82",
    },
  },
  plugins: [],
};
