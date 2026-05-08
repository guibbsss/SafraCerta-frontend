/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2e7d32',
        'secondary-yellow': '#fbc02d',
        'accent-blue': '#1976d2',
      },
    },
  },
  plugins: [],
}
