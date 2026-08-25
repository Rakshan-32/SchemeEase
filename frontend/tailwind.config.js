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
        // Primary brand color (teal)
        primary: {
          DEFAULT: '#0f766e',
          hover: '#0d6962',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/ribbon-building.jpg')",
      },
      boxShadow: {
        'card-light': '0 1px 3px 0 rgba(100, 116, 139, 0.08), 0 1px 2px 0 rgba(100, 116, 139, 0.04)',
        'card-light-hover': '0 4px 16px -4px rgba(100, 116, 139, 0.18), 0 2px 8px -2px rgba(100, 116, 139, 0.12)',
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'card-dark-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'nav-light': '0 1px 3px 0 rgba(100, 116, 139, 0.06)',
        'stat-light': '0 1px 2px 0 rgba(100, 116, 139, 0.06)',
      },
      borderRadius: {
        'card': '16px',
        'stat': '14px',
        'modal': '20px',
      },
    },
  },
  plugins: [],
}
