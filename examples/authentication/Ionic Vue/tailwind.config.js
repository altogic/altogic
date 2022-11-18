/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
