import { IUser } from '@fethcat/shared/types'
import axios from 'axios'
import { apiUrl } from '../constants.js'
import { IAuth } from '../types.js'

type ISignup = { username: string; password: string; email: string }
type ILogin = { userOrMail: string; password: string }

export async function postSignup({ username, password, email }: ISignup): Promise<IAuth> {
  const { data } = await axios.post(`${apiUrl}/signup`, { username, password, email })
  return data
}

export async function postLogin({ userOrMail, password }: ILogin): Promise<IUser> {
  const { data } = await axios.post(`${apiUrl}/login`, { userOrMail, password })
  const { user } = data
  return user
}

export async function logUser(token: string): Promise<IAuth> {
  const { data } = await axios.get(`${apiUrl}/refreshToken`, { headers: { Authorization: `Bearer ${token}` } })
  const { user } = data
  return user
}
