/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'crime-primary': '#1A5F7A',
          'crime-secondary': '#159895',
          'crime-accent': '#57C5B6',
          'crime-background': '#F8F9FA',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  