import { Cancel } from '@mui/icons-material'
import { Box, IconButton, Input, Slider, Typography } from '@mui/material'
import { ChangeEvent, Dispatch, SetStateAction, memo, useCallback, useState } from 'react'
import { IFilters } from '../../types.js'

interface IRangeSliderProps {
  label: string
  name: 'rating' | 'dateRelease' | 'duration' | 'popularity'
  min: number
  max: number
  step: number
  filters: IFilters
  setFilters: Dispatch<SetStateAction<IFilters>>
  convertLabel?: boolean
  convertLabelFn?: (value: number) => string | number
  filterValues: number[]
}

export const RangeSlider = memo(
  ({
    label,
    name,
    min,
    max,
    step,
    filters,
    setFilters,
    convertLabel = false,
    convertLabelFn = (value: number) => value,
    filterValues,
  }: IRangeSliderProps): JSX.Element => {
    const [values, setValues] = useState<number[]>(filterValues)

    const onChange = useCallback((_event: Event, newValue: number | number[]) => {
      setValues(newValue as number[])
    }, [])

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let newValues = [...values]
      const newValue = event.target.value === '' ? min : Number(event.target.value)
      if (event.target.id.startsWith('min')) newValues[0] = newValue
      if (event.target.id.startsWith('max')) newValues[1] = newValue
      setValues(newValues)
    }

    const onCommitted = useCallback(() => {
      const newFilters = { ...filters }
      newFilters[name] = values
      setFilters(newFilters)
    }, [values])

    const onClear = () => {
      setValues([min, max])
      const newFilters = { ...filters }
      newFilters[name] = [min, max]
      setFilters(newFilters)
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
