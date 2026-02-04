import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // PurgeCSS configuration
  safelist: [
    // Red
    "bg-red-500",
    "hover:bg-red-500/90",
    "text-red-500",
    // Blue
    "bg-blue-500",
    "hover:bg-blue-500/90",
    "text-blue-500",
    // Green
    "bg-green-500",
    "hover:bg-green-500/90",
    "text-green-500",
    // Yellow
    "bg-yellow-500",
    "hover:bg-yellow-500/90",
    "text-yellow-500",
    // Purple
    "bg-purple-500",
    "hover:bg-purple-500/90",
    "text-purple-500",
    // Indigo
    "bg-indigo-500",
    "hover:bg-indigo-500/90",
    "text-indigo-500",
    // Cyan
    "bg-cyan-500",
    "hover:bg-cyan-500/90",
    "text-cyan-500",
    // Fuchsia (Pink)
    "bg-fuchsia-500",
    "hover:bg-fuchsia-500/90",
    "text-fuchsia-500",
    // Orange
    "bg-orange-500",
    "hover:bg-orange-500/90",
    "text-orange-500",

    // Gray
    "bg-gray-500",
    "hover:bg-gray-500/90",
    "text-gray-500",

  ],
  theme: {
    extend: {
      /* Spacing scale: 4px base → 4,8,12,16,24,32,48,64 (Tailwind 1–16) */
      transitionDuration: {
        fast: "200ms",
        normal: "300ms",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "section-gradient": "linear-gradient(to bottom, #1e1e1e, #252526, #1e1e1e)",
      },
      colors: {
        /** VSCode Colors */
        "editor.component": "#4AC693",
        "editor.background": "#1e1e1e",
        "editor.tag": "#7A7269",
        "editor.property": "#8fe3fc",
        "editor.propertyValue": "#279df7",
        "editor.backgroundMedium": "#252526",
        "editor.backgroundLight": "#333333",
        "editor.comment": "#6A9955",
        /** End VSCode Colors */
        /** Section backgrounds: sequential light progression (wider steps) */
        section: {
          dark: "#1a1a1a",
          light: "#242424",
          lighter: "#2e2e2e",
          lightest: "#383838",
        },
      },
    },
  },
  plugins: [],
};
export default config;
