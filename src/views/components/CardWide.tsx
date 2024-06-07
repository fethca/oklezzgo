import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { memo } from 'react'

type ICardWideProps = {
  cover: string | null
  name: string
  onClick: () => void
}

const CardWide = memo(({ cover, name, onClick }: ICardWideProps): JSX.Element => {
  return (
    <Card sx={{ width: 350, height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={onClick}>
        <CardMedia component="img" height="140" image={cover || 'assets/posterholder.png'} alt={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})

CardWide.displayName = 'CardWide'
export { CardWide }
