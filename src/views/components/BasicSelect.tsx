import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { Dispatch, SetStateAction, memo } from 'react'
import { IFilters } from '../../types.js'

interface ISelectProps {
  label: string
  name: 'sortValue' | 'sortOrder' | 'image'
  items: { value: string; label: string }[]
  filters: IFilters
  setFilters: Dispatch<SetStateAction<IFilters>>
  value: string
  resetOption?: boolean
}

const BasicSelect = memo(({ label, name, items, filters, setFilters, value, resetOption }: ISelectProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target
    const newFilters = { ...filters }
    newFilters[name] = value
    setFilters(newFilters)
  }

  return (
    <div className="filter">
      <Box sx={{ minWidth: 100 }}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select value={value} label={label} onChange={handleChange} inputProps={{ id: `select-${name}` }}>
            {items.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
            {resetOption && (
              <MenuItem value="" style={{ color: 'transparent' }}>
                None
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
    </div>
  )
})

BasicSelect.displayName = 'BasicSelect'
export { BasicSelect }
