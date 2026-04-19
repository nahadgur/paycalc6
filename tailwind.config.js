/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F04C40',
          50:  '#FFF5F2',
          100: '#FFE9E6',
          200: '#FFD9D3',
          300: '#F5B9B2',
          500: '#F04C40',
          600: '#C73B2F',
          700: '#8A2820',
          800: '#5c1a14',
          900: '#2a0f0c',
        },
        kenya: {
          red: '#F04C40',
          green: '#059669',
          black: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'rise': 'rise 0.5s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
