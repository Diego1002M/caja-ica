/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cajaRojo: '#B91C1C',      /* Rojo oscuro principal */
        cajaRojoSuave: '#DC2626', /* Rojo claro para botones */
        cajaOro: '#B8860B',       /* Dorado */
      }
    },
  },
  plugins: [],
}