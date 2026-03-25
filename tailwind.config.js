/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false, // avoids conflicts with existing App.css global resets
  },
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      }
    },
  },
  plugins: [],
}
