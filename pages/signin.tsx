import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'

function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      signIn(providers?.github.id)
    } else {
      window.close()
    }
  }, [session])

  return (
    <>
      <Box
        height={'100vh'}
        display="flex"
        sx={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress sx={{ width: '200px', height: '200px' }} />
      </Box>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders()

  return {
    props: { providers: providers },
  }
}

export default SignInPage
