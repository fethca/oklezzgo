import { CircularProgress, Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, createContext, useContext } from 'react'
import { staleTime } from '../constants.js'
import { IUser } from '../models/User.js'
import { getSession } from '../services/session.js'
import { Login } from '../views/pages/Login.js'

export const SessionContext = createContext<IUser | null>(null)

export function SessionProvider({ children }: PropsWithChildren): JSX.Element {
  const {
    isPending,
    error,
    data: session,
  } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime,
  })

  if (isPending)
    return (
      <Container style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )

  if (!session || error) return <Login />

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export function useSession(): IUser {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('No session found in context, useSession must be used inside SessionProvider')
  }
  return session
}
