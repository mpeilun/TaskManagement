import { Avatar, Box, Button, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'

function HomePage() {
  const { data: session } = useSession()
  return (
    <>
      <Box display="flex" justifyContent="center">
        {session ? (
          <Box
            display="flex"
            sx={{ flexDirection: 'column', justifyContent: 'center' }}
          >
            <Typography>Name: {session?.user?.name}</Typography>
            <Typography>Email: {session?.user?.email}</Typography>
            <Button variant="outlined" sx={{ m: 2 }} onClick={() => signOut()}>
              登出
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              sx={{ m: 2 }}
              onClick={() => {
                window.open('/signin', 'Sign In', 'width=600,height=600')
              }}
            >
              登入
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default HomePage
