/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pitchBlack: "#0a0a0a",
        neonOceanBlue: "#1b6ca8",
        smokeWhite: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
