/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#7A1F2B",
          dark: "#3B0F16",
        },
        gold: {
          DEFAULT: "#C9A227",
        },
        background: "#F7F4ED",
        surface: "#FFFFFF",
        border: "#E6E1DA",
        text: {
          primary: "#1E1E1E",
          secondary: "#5F5F5F",
        },
        success: "#2E7D32",
        warning: "#F9A825",
        error: "#C62828",
        badge: {
          draft: "#BDBDBD",
          submitted: "#1976D2",
          approved: "#2E7D32",
          rejected: "#C62828",
          pending: "#F9A825",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
