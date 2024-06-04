import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { memo } from 'react'
import { useSession } from '../../contexts/SessionContext.js'
import { Logo } from './Logo.js'

export const NavBar = memo((): JSX.Element => {
  const session = useSession()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo style={{ width: '100px', fill: 'turquoise', marginRight: '20px' }} />
          <div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {session.app}
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
})
