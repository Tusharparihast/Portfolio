/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  /* FIXED: Added typography plugin to instantly support raw markdown blocks */
  plugins: [
    require('@tailwindcss/typography'),
  ],
}