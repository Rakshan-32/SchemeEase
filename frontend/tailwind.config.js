/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        primary: {
          DEFAULT: '#0f766e',
          foreground: '#ffffff'
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          foreground: '#0f172a'
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/ribbon-building.jpg')",
      }
    },
  },
  plugins: [],
}
