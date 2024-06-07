import { Button, TextField } from '@mui/material'
import { memo, useRef } from 'react'

interface SearchForm extends HTMLFormElement {
  searchInput: HTMLInputElement
}

type IAccordionFormProps = {
  buttonLabel: string
  inputLabel: string
  defaultValue: string
  formAction: (event: React.FormEvent<SearchForm>) => void
  secondButtonLabel?: string | null
  secondButtonAction?: (inputValue: string) => void
}

const AccordionForm = memo(
  ({
    buttonLabel,
    inputLabel,
    defaultValue,
    formAction,
    secondButtonLabel,
    secondButtonAction,
  }: IAccordionFormProps): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>()

    return (
      <form style={{ display: 'flex' }} onSubmit={formAction}>
        <TextField
          sx={{ margin: '0 30px 30px 0', width: '50%' }}
          inputRef={inputRef}
          type="input"
          id="searchInput"
          label={inputLabel}
          defaultValue={defaultValue}
        />

        <Button type="submit" sx={{ margin: '0 30px 30px 0' }}>
          {buttonLabel}
        </Button>
        {secondButtonLabel && secondButtonAction && (
          <Button
            onClick={() => {
              if (inputRef.current) secondButtonAction(inputRef.current.value)
            }}
            sx={{ margin: '0 30px 30px 0' }}
          >
            {secondButtonLabel}
          </Button>
        )}
      </form>
    )
  },
)

AccordionForm.displayName = 'AccordionForm'
export { AccordionForm }
