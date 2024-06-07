import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { Dispatch, SetStateAction, memo, useCallback } from 'react'
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

export const BasicSelect = memo(({ label, name, items, filters, setFilters, value, resetOption }: ISelectProps) => {
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const { value } = event.target
      const newFilters = { ...filters }
      newFilters[name] = value
      setFilters(newFilters)
    },
    [filters],
  )

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
