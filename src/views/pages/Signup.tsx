import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as validator from 'validator'
import { useSession } from '../../contexts/SessionContext.js'
import { useSnackBar } from '../../contexts/SnackbarContext.js'
import { postSignup } from '../../services/session.js'
import { validateAlphanumeric } from '../../utils.js'

const usernameError = 'Caractères spéciaux autorisés _ - * ! @'
const mailError = 'Email non valide'
const pwdError = '6 caractères minimum'

type IValidation = (value: string) => boolean
const validationMap: { [key: string]: IValidation } = {
  username: validateAlphanumeric,
  email: validator.isEmail,
  password: (value: string) => value.length > 6,
}

const Signup = memo((): JSX.Element => {
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const [formValidation, setFormValidation] = useState<Record<string, boolean>>({
    username: false,
    password: false,
    email: false,
  })
  const [disable, setDisable] = useState(true)
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useSession()

  const signup = useMutation({
    mutationFn: postSignup,
    onSuccess: ({ user, accessToken, refreshToken }) => {
      showSnackBar(`Bienvenue ${user?.username}`, 'success')
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setAuth({ user, accessToken, refreshToken })
      navigate('/')
    },
    onError: (_error) => {
      showSnackBar('Impossible de se connecter. Veuillez réésayer', 'error')
    },
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    signup.mutate(form)
  }

  const handleChange = (target: 'password' | 'email' | 'username') => (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [target]: event.target.value })
  }

  useEffect(() => {
    const newFormValidation = { ...formValidation }
    Object.entries(form).forEach(([key, value]) => {
      newFormValidation[key] = validationMap[key](value)
    })

    setFormValidation(newFormValidation)

    const { username, password, email } = newFormValidation
    setDisable(!(username && password && email))
  }, [form])

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Créer un compte
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom d'utilisateur"
          variant="outlined"
          margin="normal"
          value={form.username}
          onChange={handleChange('username')}
          required
          error={!!form.username && !formValidation.username}
          helperText={!!form.username && !formValidation.username && usernameError}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          required
          error={!!form.email && !formValidation.email}
          helperText={!!form.email && !formValidation.email && mailError}
        />
        <TextField
          fullWidth
          label="Mot de passe"
          variant="outlined"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange('password')}
          required
          error={!!form.password && !formValidation.password}
          helperText={!!form.password && !formValidation.password && pwdError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: 1 }}>
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!form.password || !form.email || !form.username || signup.isPending || disable}
        >
          S'inscrire
        </Button>
        <Button fullWidth sx={{ mt: 2 }} disabled={signup.isPending} component={Link} to="/login">
          Se connecter
        </Button>
      </form>
    </Container>
  )
})

Signup.displayName = 'Signup'
export { Signup }
