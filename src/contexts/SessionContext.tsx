import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { logUser } from '../services/session.js'
import { IAuth } from '../types.js'

interface IAuthContext {
  auth: IAuth
  setAuth: (auth: IAuth) => void
}

const SessionContext = createContext<IAuthContext | null>(null)

const initAuth = async (setAuth: Dispatch<SetStateAction<IAuth>>) => {
  const token = localStorage.getItem('token')
  if (!token) return
  const { accessToken, refreshToken, user } = await logUser(token)
  localStorage.setItem('refreshToken', refreshToken)
  setAuth({ accessToken, refreshToken, user })
}

export function SessionProvider({ children }: PropsWithChildren): JSX.Element {
  const [auth, setAuth] = useState<IAuth>({ user: null, accessToken: '', refreshToken: '' })

  useEffect(() => {
    initAuth(setAuth)
  }, [])

  return <SessionContext.Provider value={{ auth, setAuth }}>{children}</SessionContext.Provider>
}

export function useSession(): IAuthContext {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('No session found in context, useSession must be used inside SessionProvider')
  }
  return session
}
