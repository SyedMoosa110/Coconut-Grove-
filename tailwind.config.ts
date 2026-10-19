import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#07140E",
        forest: { DEFAULT: "#0B1D14", deep: "#07140E" },
        charcoal: "#121212",
        gold: { DEFAULT: "#D4AF37", soft: "#E6CB75", pale: "#F3E3A6" },
        cream: "#F9F8F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { luxe: "cubic-bezier(0.16, 1, 0.3, 1)" },
      keyframes: {
        glow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,.45)" },
          "50%": { boxShadow: "0 0 34px 4px rgba(212,175,55,.35)" },
        },
        ping2: { "0%": { transform: "scale(1)", opacity: ".7" }, "100%": { transform: "scale(2.6)", opacity: "0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        sheen: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        scrollcue: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
      },
      animation: {
        glow: "glow 2.6s ease-in-out infinite",
        ping2: "ping2 2s ease-out infinite",
        float: "float 5s ease-in-out infinite",
        sheen: "sheen 3.5s linear infinite",
        scrollcue: "scrollcue 2.2s cubic-bezier(0.16,1,0.3,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
