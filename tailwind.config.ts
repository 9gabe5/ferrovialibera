import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blu: "#16356B",
        "blu-scuro": "#0E2347",
        antracite: "#1C1E21",
        latte: "#FAFAF8",
        pietrisco: "#6B7280",
        segnale: "#C8311F",
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        body: ["'Albert Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
