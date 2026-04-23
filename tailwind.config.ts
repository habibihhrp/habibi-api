import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        panel: "#12121a",
        panel2: "#1a1a25",
        border: "#2a2a3a",
        text: "#e8e8f0",
        muted: "#8a8aa0",
        accent: "#a78bfa",
        accent2: "#f472b6",
        success: "#34d399",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
