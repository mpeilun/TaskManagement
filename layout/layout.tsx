import Navbar from '@/component/navbar'
import theme from '@/styles/theme'
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

function Layout(props: { children: ReactNode }) {
  const { children } = props
  const { asPath } = useRouter()

  return (
    <>
      <Head>
        <title>Task Management</title>
        <meta
          name="description"
          content="2023 Dcard Frontend Intern Homework"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { margin: 0, backgroundColor: grey[200] },
          }}
        />

        {asPath !== '/signin' && <Navbar />}
        <main>{children}</main>
      </ThemeProvider>
    </>
  )
}

export default Layout
