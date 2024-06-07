import { Autocomplete, Chip, TextField } from '@mui/material'
import { SyntheticEvent, memo } from 'react'
import { IFilterOption } from '../../types.js'

type IMultiSelectProps = {
  label: string
  options: IFilterOption[]
  value: IFilterOption[]
  onInputChange: (_event: SyntheticEvent, value: string) => void
  onChange: (_event: SyntheticEvent, values: (string | IFilterOption)[]) => void
}

export const AutoCompleteLabelChip = memo(({ label, options, value, onChange, onInputChange }: IMultiSelectProps) => {
  return (
    <div className="filter">
      <Autocomplete
        sx={{ padding: '15px', width: '500px' }}
        multiple
        freeSolo
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        filterOptions={(x) => x}
        filterSelectedOptions
        value={value || []}
        renderInput={(params) => <TextField {...params} variant="standard" label={label} />}
        renderTags={(value, props) => {
          return value.map((option, index) => <Chip {...props({ index })} key={option.id} label={option.name} />)
        }}
        onInputChange={onInputChange}
        onChange={onChange}
      />
    </div>
  )
})
