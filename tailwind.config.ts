import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accento: "#2F6E5E",
        "accento-scuro": "#234E43",
        pastello: "#DCEBE4",
        antracite: "#1C1E21",
        latte: "#FAFAF8",
        pietrisco: "#6B7280",
        segnale: "#C8311F",
      },
      fontFamily: {
        marchio: ["'Bricolage Grotesque Variable'", "'Bricolage Grotesque'", "system-ui", "sans-serif"],
        display: ["Archivo", "system-ui", "sans-serif"],
        body: ["'Albert Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
