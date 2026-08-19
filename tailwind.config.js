/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        toyota: {
          red: '#D91424',
          darkRed: '#9E0B16',
          black: '#121212',
          panel: '#1A1D20',
          darker: '#141618',
          border: '#2C3238',
          highlight: '#F59E0B',
          amber: '#F59E0B',
          green: '#10B981',
          blue: '#3B82F6',
          gray: '#9CA3AF'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
