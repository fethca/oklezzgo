import { Star } from '@mui/icons-material'
import { Rating } from '@mui/material'
import { grey } from '@mui/material/colors'
import { memo } from 'react'

const CardFooter = memo(({ rating }: { rating: number }): JSX.Element => {
  return (
    <>
      <Rating
        name="half-rating-read"
        value={(rating / 10) * 5}
        precision={0.5}
        readOnly
        emptyIcon={<Star sx={{ color: grey[500] }} fontSize="inherit" />}
      />
      <span>{rating?.toFixed(1)}</span>
    </>
  )
})

CardFooter.displayName = 'CardFooter'
export { CardFooter }
