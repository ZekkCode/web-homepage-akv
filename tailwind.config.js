/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        akv: {
          blue: '#0B5CFF',
          'blue-dark': '#0847C4',
          royal: '#1E3C8F',
          navy: '#0D1B3D',
          'navy-soft': '#12275E',
          sky: '#7FAEE8',
          light: '#DCEBFF',
          pale: '#F4F8FF',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Manrope',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 6px 24px -6px rgba(18, 39, 94, 0.14)',
        'card-hover': '0 14px 34px -8px rgba(18, 39, 94, 0.22)',
        panel: '0 10px 40px -10px rgba(18, 39, 94, 0.25)',
      },
      borderRadius: {
        card: '16px',
        feature: '24px',
      },
      keyframes: {
        'canopy-x': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        'canopy-horizontal': 'canopy-x var(--duration) infinite linear',
      },
    },
  },
  plugins: [],
}
