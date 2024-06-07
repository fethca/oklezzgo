import { Cancel } from '@mui/icons-material'
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { Dispatch, memo, useCallback } from 'react'
import { IFilters } from '../../types.js'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

type IMultiSelectProps = {
  label: string
  name: 'categories' | 'countries' | 'genres'
  data: { label: string; id: number }[]
  filters: IFilters
  setFilters: Dispatch<React.SetStateAction<IFilters>>
  values: string[]
}

function getStyles(id: number, items: readonly { label: string; id: number }[], theme: Theme) {
  return {
    fontWeight: items.find((item) => item.id === id)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  }
}

const MultiSelectLabelsChip = memo(({ label, name, data, filters, setFilters, values }: IMultiSelectProps) => {
  const theme = useTheme()

  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const values = event.target.value
      const newFilters = { ...filters }
      newFilters[name] = typeof values === 'string' ? values.split(',') : values
      setFilters(newFilters)
    },
    [filters, name, setFilters],
  )

  const handleDelete = useCallback(
    (deleteValue: string) => {
      const newFilters = { ...filters }
      newFilters[name] = values.filter((value) => value != deleteValue) || []
      setFilters(newFilters)
    },
    [filters, name, values, setFilters],
  )

  return (
    <div className="filter">
      <FormControl sx={{ minWidth: 300, maxWidth: 500 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={values}
          autoWidth
          onChange={handleChange}
          input={<OutlinedInput id={`select-multiple-chip-${name}`} label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  deleteIcon={<Cancel onMouseDown={(event) => event.stopPropagation()}></Cancel>}
                  onDelete={() => handleDelete(value)}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {data.map((item) => (
            <MenuItem key={item.id} value={item.label} style={getStyles(item.id, data, theme)}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
})

MultiSelectLabelsChip.displayName = 'MultiSelectLabelsChip'
export { MultiSelectLabelsChip }
