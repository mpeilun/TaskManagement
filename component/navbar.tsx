import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

function Navbar() {
  const { data: session } = useSession()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management
          </Typography>
          {session ? (
            <Tooltip title={session.user.name}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{ width: '32px', height: '32px' }}
                  src={session.user.image}
                  alt="Profile"
                >
                  <Image
                    src={session?.user?.image!}
                    alt="ProfilePhoto"
                    width={200}
                    height={200}
                  />
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={'SignIn'}>
              <IconButton
                onClick={() => {
                  window.open('/signin', 'Sign In', 'width=600,height=600')
                }}
                sx={{ p: 0 }}
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <LoginIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
          <Menu
            sx={{ mt: '40px' }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => signOut()}>
              <Typography textAlign="center">{'SignOut'}</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
