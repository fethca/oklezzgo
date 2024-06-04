import { Cancel } from '@mui/icons-material'
import { Box, IconButton, Input, Slider, Typography } from '@mui/material'
import { ChangeEvent, Dispatch, SetStateAction, memo, useCallback } from 'react'
import { IFilters } from '../../types.js'

interface IRangeSliderProps {
  label: string
  name: 'rating' | 'dateRelease' | 'duration' | 'popularity'
  min: number
  max: number
  step: number
  filters: IFilters
  onFiltersChange: Dispatch<SetStateAction<IFilters>>
  convertLabel?: boolean
  convertLabelFn?: (value: number) => string | number
  values: number[]
  setValues: Dispatch<SetStateAction<number[]>>
}

export const RangeSlider = memo(
  ({
    label,
    name,
    min,
    max,
    step,
    filters,
    onFiltersChange,
    convertLabel = false,
    convertLabelFn = (value: number) => value,
    values,
    setValues,
  }: IRangeSliderProps): JSX.Element => {
    const onChange = useCallback((_event: Event, newValue: number | number[]) => {
      setValues(newValue as number[])
    }, [])

    const onCommitted = useCallback(() => {
      const newFilters = { ...filters }
      newFilters[name] = values
      onFiltersChange(newFilters)
    }, [values])

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let newValues = [...values]
      const newValue = event.target.value === '' ? min : Number(event.target.value)
      if (event.target.id === 'min') newValues[0] = newValue
      if (event.target.id === 'max') newValues[1] = newValue
      setValues(newValues)
    }

    const onClear = () => {
      setValues([min, max])
    }

    return (
      <div className="range-slider">
        <Typography id="input-slider" gutterBottom>
          {label}
          <IconButton onClick={onClear} size="small" sx={{ marginLeft: '4px' }} aria-label="delete">
            <Cancel fontSize="small" />
          </IconButton>
        </Typography>
        <Box sx={{ width: 150 }}>
          <Slider
            value={values}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            onChangeCommitted={onCommitted}
            valueLabelFormat={(value) => convertLabelFn(value)}
            valueLabelDisplay="auto"
          />
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className={convertLabel ? 'convert-label' : ''}
          >
            <div className="range-slider__input-wrapper">
              <Input
                id={`min-${name}`}
                value={values[0]}
                size="small"
                onChange={onInputChange}
                onMouseUp={onCommitted}
                slotProps={convertLabel ? { input: { style: { color: 'transparent', zIndex: 10 } } } : {}}
                inputProps={{ step, min, max, type: 'number' }}
              />
              <span>{convertLabelFn(values[0])}</span>
            </div>
            <div className="range-slider__input-wrapper">
              <Input
                id={`max-${name}`}
                value={values[1]}
                size="small"
                onChange={onInputChange}
                onMouseUp={onCommitted}
                slotProps={convertLabel ? { input: { style: { color: 'transparent', zIndex: 10 } } } : {}}
                inputProps={{ step, min, max, type: 'number' }}
              />
              <span>{convertLabelFn(values[1])}</span>
            </div>
          </div>
        </Box>
      </div>
    )
  },
)
