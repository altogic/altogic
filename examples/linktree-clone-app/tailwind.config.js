/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				pansy: 'rgb(129 41 217)',
				teasel: 'rgb(93 24 162)',
				chalk: 'rgb(239 240 236)',
				concrete: 'rgb(103 107 95)',
			},
			spacing: {
				'2xs': '0.25rem',
				sm: '0.75rem',
				md: '1rem',
				lg: '1.5rem',
				xl: '2rem',
				'2xl': '3rem',
			},
		},
	},
	plugins: [],
};
