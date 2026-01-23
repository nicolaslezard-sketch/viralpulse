/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        floatSlow: {
          "0%": { transform: "translate(-50%, 0px)" },
          "50%": { transform: "translate(-50%, 40px)" },
          "100%": { transform: "translate(-50%, 0px)" },
        },
        floatSide: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-60px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 20s ease-in-out infinite",
        floatSideA: "floatSide 26s ease-in-out infinite",
        floatSideB: "floatSide 30s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
