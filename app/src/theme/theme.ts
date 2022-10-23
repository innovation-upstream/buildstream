export interface Theme {
  color: {
    text: {
      primary: string,
      secondary: string
      white: string
    },
    background: {
      common: {
        white: string
      },
      page: {
        white: string
      },
      card: {
        grey1: string
        grey2: string
      },
      button: {
        primary: string
      }
    }
  }
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export { defaultTheme } from './themes/default'
