const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1440px'
      },
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
      gap: {
        full: '100%',
      },
      boxShadow: {
        paper: '0px 4px 24px rgba(0, 0, 0, 0.03)',
        tooltip: '0px 0px 24px rgba(0, 0, 0, 0.12)'
      },
      container: {
        center: true
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  safelist: [
    'z-[61]',
    'z-[62]'
  ],
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}
