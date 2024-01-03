/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,jsx,js,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("flowbite/plugin")],
  theme: {
    colors: {
      background: "#f5f5f5",
      text: "#0d0d0d",
      icon: "#525252",
      border: "#d9d9d9",
      primary: "#38c876",
      secondary: "#2955d9",
      danger: "#f25252",
      disabled: "#0d0d0d",
    },
  },
};
