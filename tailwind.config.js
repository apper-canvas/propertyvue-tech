/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5F2D',
        secondary: '#97BC62', 
        accent: '#E07A5F',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif']
      },
      animation: {
        'zoom-in': 'zoomIn 0.2s ease-out',
        'zoom-out': 'zoomOut 0.2s ease-out',
      },
      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      }
    },
  },
plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-custom': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#2C5F2D #f1f5f9',
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          'width': '8px',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          'background': '#f1f5f9',
          'border-radius': '4px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          'background': '#2C5F2D',
          'border-radius': '4px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb:hover': {
          'background': '#97BC62',
        },
        '.gallery-zoom': {
          'cursor': 'zoom-in',
        },
        '.gallery-zoom-out': {
          'cursor': 'zoom-out',
        },
        '.gallery-dragging': {
          'cursor': 'grabbing',
          'user-select': 'none',
        },
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}