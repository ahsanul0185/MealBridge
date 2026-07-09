/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        accent: "#f97316",
        "warm-white": "#fafaf9",
        "dark-gray": "#374151",
      },
    },
  },
  plugins: [],
};
