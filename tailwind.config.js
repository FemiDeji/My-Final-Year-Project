/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Adjust the paths as needed
	theme: {
		extend: {
			colors: {
				"general-blue": "#002855",
				"general-grey": "#DFE6EC",
				"general-light-grey": "#f5f5f5",
				"general-mid-grey": "#dddad1",
				"general-light-red": "#E46561",
				"general-green": "#4d8c71",
				"general-red": "#FF000033",
				"general-yellow": "#f2c008",
				"general-bg": "#fafafa",
			},
			screens: {
				xs: { min: "320px", max: "769px" },
				cl: { max: "769px" },
			},
		},
	},
	plugins: [],
};
