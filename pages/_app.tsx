import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Layout from '@/layout/layout'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}
