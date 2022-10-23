import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './theme'

const Provider: React.FC<any> = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  )
}

export default Provider
