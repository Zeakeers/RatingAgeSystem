/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        'primary': '#FF0000',
        'secondary': '#00FF00',
        'tertiary': '#0000FF',
        'quaternary': '#FFFF00',
        'quinary': '#FF00FF',
        'darkpurple' : '#494287',
        'yellowlight' : '#ffcc23'

      }
    },
  },
  plugins: [],
}
