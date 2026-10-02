import type { Config } from "tailwindcss";

/**
 * Tailwind theme — dark, electric-blue palette.
 * Colors mirror the CSS variables in src/app/globals.css.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a14",          // near-black page background
        surface: "#111228",     // cards / panels
        "surface-2": "#171936", // raised surfaces
        border: "#23264d",      // subtle borders
        accent: {
          DEFAULT: "#60A5FA",   // softened blue (text highlights) — was neon cyan
          blue: "#3B82F6",      // primary calm blue accent
          deep: "#1E3A8A",      // deep blue
        },
        text: "#e6e9f5",
        "text-muted": "#8b93b8",
      },
    },
  },
  plugins: [],
};

export default config;
