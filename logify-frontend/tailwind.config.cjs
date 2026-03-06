/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          50: "#f9f6f2",
          100: "#f3ece4",
          200: "#e6d6c3",
          300: "#d9bfa2",
          400: "#c08f61",
          500: "#a76f3a",
          600: "#8c5527",
          700: "#6b401d",
          800: "#4a2b13",
          900: "#2a160a",
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
