import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { memo } from 'react'

type IAccordionProps = {
  props: { title: string; Content: () => JSX.Element }
}

export const DetailAccordion = memo(({ props }: IAccordionProps): JSX.Element => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>{props.title}</AccordionSummary>
      <AccordionDetails className="accordion">{props.Content()}</AccordionDetails>
    </Accordion>
  )
})
