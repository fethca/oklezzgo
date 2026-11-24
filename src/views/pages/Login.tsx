import { Button, Container, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSnackBar } from '../../contexts/SnackbarContext.js'
import { postLogin } from '../../services/session.js'

const Login = memo((): JSX.Element => {
  const [userOrMail, setUserOrPwd] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()

  const login = useMutation({
    mutationFn: postLogin,
    onSuccess: (_data) => {
      navigate('/login')
    },
    onError: (_error) => {
      showSnackBar('Impossible de se connecter. Veuillez réésayer', 'error')
    },
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    login.mutate({ userOrMail, password })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom d'utilisateur ou mail"
          margin="normal"
          variant="outlined"
          value={userOrMail}
          onChange={(event) => setUserOrPwd(event.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Mot de passe"
          margin="normal"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={login.isPending}>
          Se connecter
        </Button>
        <Button fullWidth sx={{ mt: 2 }} disabled={login.isPending} component={Link} to="/signup">
          Créer un compte
        </Button>
      </form>
    </Container>
  )
})

Login.displayName = 'Login'
export { Login }
