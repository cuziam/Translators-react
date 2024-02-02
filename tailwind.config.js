/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/client/**/*.{html,jsx,js,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("flowbite/plugin")],
  theme: {
    colors: {
      primary: "#38c876",
      primaryGray: "#CCF5DF",
      secondary: "#2955d9",
      secondaryGray: "81D6A5",
      danger: "#f25252",
      dangerGray: "#EB9E9E",
      text: "#0d0d0d",
      background: "#f5f5f5",

      icon: "#525252",
      border: "#d9d9d9",

      enabled: "#D9D9D9",
      disabled: "#0d0d0d",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      righteous: ["Righteous", "cursive"],
    },
  },
};
