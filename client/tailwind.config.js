/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plu: {
          black:  "#0E0E0E",
          yellow: "#FFD400",
          red:    "#C8102E",
          gray:   "#F4F4F5",
          slate:  "#1F1F23",
        },
        status: {
          tentative: "#F59E0B",
          approved:  "#10B981",
          rejected:  "#EF4444",
          info:      "#3B82F6",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "1rem" },
    },
  },
  plugins: [],
};
