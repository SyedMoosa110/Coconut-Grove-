import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#0F241A", deep: "#0A1A12" },
        charcoal: "#121212",
        gold: { DEFAULT: "#D4AF37", soft: "#E6CB75" },
        cream: "#F9F8F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        glow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,.45)" },
          "50%": { boxShadow: "0 0 30px 4px rgba(212,175,55,.35)" },
        },
        ping2: { "0%": { transform: "scale(1)", opacity: ".7" }, "100%": { transform: "scale(2.6)", opacity: "0" } },
      },
      animation: { shimmer: "shimmer 4s linear infinite", glow: "glow 2.6s ease-in-out infinite", ping2: "ping2 2s ease-out infinite" },
    },
  },
  plugins: [],
};
export default config;
