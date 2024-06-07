import { Skeleton, Stack } from '@mui/material'
import { memo } from 'react'

const CardsSkeleton = memo((): JSX.Element => {
  return (
    <>
      {[...Array(24).keys()].map((key) => (
        <div key={key} className="movie-item">
          <Stack>
            <div className="movie-item__cover">
              <div className="movie-item__cover-image-wrapper">
                <Skeleton className="movie-item__cover-image" variant="rectangular" width={'100%'} height={'100%'} />
              </div>
            </div>
            <Skeleton className="movie-item__title" />
            <Skeleton />
          </Stack>
        </div>
      ))}
    </>
  )
})

CardsSkeleton.displayName = 'CardsSkeleton'
export { CardsSkeleton }
