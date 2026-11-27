/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
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
        surface: {
          base:   "var(--surface-base)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
        },
        ink: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          inverse:   "var(--text-inverse)",
        },
        line: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        focus: "var(--focus-ring-color)",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "1rem" },
      minHeight: { touch: "var(--touch-min)", comfortable: "var(--touch-comfortable)" },
      minWidth:  { touch: "var(--touch-min)", comfortable: "var(--touch-comfortable)" },
    },
  },
  plugins: [],
};
