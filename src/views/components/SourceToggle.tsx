import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { MouseEvent, memo } from 'react'
import { ISource } from '../../types.js'

type ISourceToggleProps = {
  value: ISource
  onChange: (source: ISource) => void
}

const SourceToggle = memo(({ value, onChange }: ISourceToggleProps) => {
  const handleChange = (_event: MouseEvent<HTMLElement>, source: ISource | null) => {
    if (source) onChange(source)
  }

  return (
    <ToggleButtonGroup size="small" color="primary" exclusive value={value} onChange={handleChange}>
      <ToggleButton value="senscritique">SC</ToggleButton>
      <ToggleButton value="tmdb">TMDB</ToggleButton>
    </ToggleButtonGroup>
  )
})

SourceToggle.displayName = 'SourceToggle'
export { SourceToggle }
