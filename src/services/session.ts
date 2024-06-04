import axios from 'axios'
import { apiUrl } from '../constants.js'
import { IUser } from '../models/User.js'

export function getSession(): Promise<IUser> {
  return axios.get(`${apiUrl}/status`).then((res) => res.data)
}
