/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        editor: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          tab: '#2d2d30',
          border: '#3e3e42',
          text: '#cccccc',
          accent: '#007acc',
        }
      }
    },
  },
  plugins: [],
}