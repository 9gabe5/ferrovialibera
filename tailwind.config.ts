import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accento: "#C01C7C",
        "accento-scuro": "#97135F",
        antracite: "#1C1E21",
        latte: "#FAFAF8",
        pietrisco: "#6B7280",
        segnale: "#C8311F",
      },
      fontFamily: {
        marchio: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        display: ["Archivo", "system-ui", "sans-serif"],
        body: ["'Albert Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
