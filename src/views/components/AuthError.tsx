import { memo } from 'react'

const AuthError = memo((): JSX.Element => {
  return <span>bojour le canare</span>
})

AuthError.displayName = 'AuthError'
export { AuthError }
