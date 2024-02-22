import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        /** VSCode Colors */
        "editor.component": "#4AC693",
        "editor.background": "#1e1e1e",
        "editor.tag": "#7A7269",
        "editor.property": "#8fe3fc",
        "editor.propertyValue": "#279df7",
        /** End VSCode Colors */
      },
    },
  },
  plugins: [],
};
export default config;
