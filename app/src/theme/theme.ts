export interface Theme {
  color: {
    text: {
      primary: string,
      secondary: string
      white: string,
      grey1: string,
      grey2: string,
      blue: string
    },
    background: {
      common: {
        white: string,
        grey1: string
      },
      page: {
        white: string
        black: string
      },
      card: {
        grey1: string
        grey2: string
      },
      paper: {
        primary: string
      },
      button: {
        primary: string,
        grey1: string
      },
    }
  }
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export { defaultTheme } from './themes/default'
