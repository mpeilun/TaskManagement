import { createTheme } from '@mui/material/styles'
import { Open_Sans } from '@next/font/google'
import { grey, red, green } from '@mui/material/colors'
const { palette } = createTheme()

export const themeFont = Open_Sans({ subsets: ['latin'] })
const theme = createTheme({
  typography: {
    fontFamily: themeFont.style.fontFamily,
  },
  palette: {
    github: {
      main: '#000',
    },
    taskOpen: {
      main: grey[200],
    },
    taskInProgress: {
      main: red[200],
    },
    taskDone: {
      main: green[200],
    },
  },
})

//custom theme type
export default theme
declare module '@mui/material/styles' {
  interface Palette {
    github: Palette['primary']
    taskOpen: Palette['primary']
    taskInProgress: Palette['primary']
    taskDone: Palette['primary']
  }

  interface PaletteOptions {
    github: PaletteOptions['primary']
    taskOpen: PaletteOptions['primary']
    taskInProgress: PaletteOptions['primary']
    taskDone: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    github: true
  }
}

// declare module '@mui/material/Radio' {
//   interface RadioPropsColorOverrides {
//     taskOpen: true
//     taskInProgress: true
//     taskDone: true
//   }
// }
