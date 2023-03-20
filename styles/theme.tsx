import { createTheme } from '@mui/material/styles'
import { Open_Sans } from '@next/font/google'

export const themeFont = Open_Sans({ subsets: ['latin'] })
const theme = createTheme({
  typography: {
    fontFamily: themeFont.style.fontFamily,
  },
  palette: {
    github: {
      main: '#000',
    },
  },
})

//custom theme type
export default theme
declare module '@mui/material/styles' {
  interface Palette {
    github: Palette['primary']
  }

  interface PaletteOptions {
    github: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    github: true
  }
}
