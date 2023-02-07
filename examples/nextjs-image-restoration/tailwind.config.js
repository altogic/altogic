/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      spacing: {
        header: "4.5rem",
      },
      container: {
        screens: {
          lg: "768px",
          xl: "1024px",
          "2xl": "1280px",
        },
      },
    },
  },
  plugins: [],
};
