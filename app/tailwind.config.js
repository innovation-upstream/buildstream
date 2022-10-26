const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        8: '8px',
        9: '2.5rem'
      },
      container: {
        center: true,
        padding: '2rem'
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
}
