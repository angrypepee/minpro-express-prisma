/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/web/src/**/*.{js,ts,jsx,tsx,mdx}', 
    './apps/web/src/app/**/*.{js,ts,jsx,tsx,mdx}', 
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}