import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0d8112",
          hover: "#0a6a0e",
        },
        muted: "#585858",
        surface: "#ffffff",
        page: "#f5f5f5",
        line: "#c6c6c6",
        "avatar-line": "#aeaeae",
        gift: {
          DEFAULT: "#ffb8ef",
          line: "#e7aada",
          text: "#773e75",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        design: "-0.41px",
      },
    },
  },
  plugins: [],
};

export default config;
