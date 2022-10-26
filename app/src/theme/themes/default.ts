import { Theme } from '../theme'

export const defaultTheme: Theme = {
  color: {
    text: {
      primary: '#000000',
      secondary: 'rgb(0, 0, 0, 50%)',
      white: '#FFFFFF',
      grey1: 'rgba(255, 255, 255, 0.6)',
      grey2: '#686C6F',
      blue: '#3667EA'
    },
    background: {
      common: {
        white: '#ffffff',
        grey1: '#B7B7B7'
      },
      page: {
        white: '#ffffff',
        black: '#000000'
      },
      card: {
        grey1: '#D9D9D9',
        grey2: 'rgba(39, 39, 44, 0.2)'
      },
      button: {
        primary: '#3667EA',
        grey1: '#EFF0F1',
      }
    }
  }
}
