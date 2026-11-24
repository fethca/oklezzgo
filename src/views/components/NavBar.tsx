import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../../contexts/SessionContext.js'
import { Logo } from './Logo.js'

const NavBar = memo((): JSX.Element => {
  const session = useSession()

  const logout = () => {
    //log user
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/">
            <Logo style={{ width: '100px', fill: 'turquoise', marginRight: '20px' }} />
          </Link>
          <div>
            {session.auth.user ? (
              <Button component={Link} to={`/user/${session.auth.user.username}`}>
                {session.auth.user.username}
              </Button>
            ) : (
              <>
                <Button component={Link} to="/login">
                  Connexion
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
})

NavBar.displayName = 'NavBar'
export { NavBar }
