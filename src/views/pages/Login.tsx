import { Button, Container } from '@mui/material'
import { memo, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext.js'
import { Logo } from '../components/Logo.js'

const Login = memo((): JSX.Element => {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />

  return (
    <Container
      className="d-flex flex-column justify-content-evenly align-items-center col-3 mt-5 rounded border"
      style={{ height: '30vh' }}
    >
      <Logo style={{ width: '250px', fill: 'turquoise' }} />
      <Button size="large" href="/api/auth">
        LOG IN WITH SSO
      </Button>
    </Container>
  )
})

Login.displayName = 'Login'
export { Login }
