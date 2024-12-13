// tailwind.config.js

import { primaryColor, secondaryColor } from "./src/styles/Var.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "max-sm": { max: "540px" },
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(90deg, hsla(00, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)",
      },
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          /* Hide scrollbar for Webkit-based browsers (e.g., Chrome, Safari) */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* Hide scrollbar for IE and Edge */
          "-ms-overflow-style": "none",
          /* Hide scrollbar for Firefox */
          "scrollbar-width": "none",
        },
      });
    },
  ],
};
