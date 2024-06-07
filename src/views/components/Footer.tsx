import { memo } from 'react'
import { Logo } from './Logo.js'

const year = new Date().getFullYear()
const version = __APP_VERSION__

export const Footer = memo((): JSX.Element => {
  return (
    <div className="footer">
      <Logo style={{ fill: 'turquoise' }} />
      <small>© ok lezgo {year}. gulughluglulglulu rights reserved</small>
      <small>v{version}</small>
    </div>
  )
})
