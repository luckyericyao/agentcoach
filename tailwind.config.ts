import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#050505",
        ink: "#0a0b0d",
        graphite: "#17191d",
        platinum: "#f5f3ef",
        steel: "#a8adb5",
        ion: "#7fd4ff",
        ember: "#d7b46a",
      },
      fontFamily: {
        sans: [
          "var(--font-agentcoach)",
          "Inter",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        "inner-line": "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "field-lines":
          "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;

