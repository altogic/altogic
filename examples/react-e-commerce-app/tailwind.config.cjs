/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        primary: '#FF0000',
        secondary: '#E0E0E0'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'),require('flowbite/plugin'), require('@tailwindcss/line-clamp')],
}
