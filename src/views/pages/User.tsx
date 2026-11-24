import { memo } from 'react'
import { useParams } from 'react-router-dom'

const User = memo((): JSX.Element => {
  const { id } = useParams()
  return <>User {id}</>
})

User.displayName = 'User'
export { User }
