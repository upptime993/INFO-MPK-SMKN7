import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3A5C",
          dark: "#12273F",
          light: "#285280",
        },
        gold: {
          DEFAULT: "#D9A441",
          light: "#E6BA65",
          dark: "#B58229",
        },
        stamp: {
          red: "#B23A2E",
        },
        pass: {
          green: "#2F6E4F",
        },
        paper: {
          DEFAULT: "#FAF8F3",
          card: "#FFFFFF",
          muted: "#F3EFE6",
        },
        ink: {
          DEFAULT: "#232323",
          light: "#555555",
          muted: "#888888",
        },
      },
      fontFamily: {
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: {
        paper: "0 2px 10px rgba(27, 58, 92, 0.05)",
        stamp: "0 4px 12px rgba(178, 58, 46, 0.15)",
        navy: "0 10px 25px -5px rgba(27, 58, 92, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
