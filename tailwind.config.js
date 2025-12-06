/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E8E4DC', // Warm beige cream
        foreground: '#000000', // Black text
        primary: {
          DEFAULT: '#000000', // Black for primary elements
          foreground: '#E8E4DC', // Beige text on black backgrounds
        },
        border: '#D1CFC8', // Subtle beige border
        accent: '#C4BEB2', // Slightly darker beige for accents
      },
      fontFamily: {
        sentient: ['Sentient', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 8px 2px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
} 