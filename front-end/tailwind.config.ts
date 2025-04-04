import type { Config } from "tailwindcss";
import dotenv from "dotenv";
import { getEnvColor } from "./app/utils";

// Load environment variables
dotenv.config({ path: "../.env" });

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#" + getEnvColor("background", "210e49"),
        primary: "#" + getEnvColor("primary", "#00f5c0"),
        secondary: "#" + getEnvColor("secondary", "#fc0589"), // Neon pink
        accent: "#" + getEnvColor("accent", "#f9a826"),
        yes: "#" + getEnvColor("yes", "#63f5bd"),
        no: "#" + getEnvColor("no", "#ff6a8c"),
        surface: "#" + getEnvColor("surface", "#341f6f"),
        text: "#" + getEnvColor("text", "#e1d5ff"),
        heading: "#" + getEnvColor("heading", "#a788ff"),
        vote: "#" + getEnvColor("vote", "#8f5cff"),
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
