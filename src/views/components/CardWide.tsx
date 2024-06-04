import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { memo } from 'react'

type ICardWideProps = {
  props: {
    cover: string
    name: string
    id: number
    participationCount: number
  }
}

export const CardWide = memo(({ props }: ICardWideProps): JSX.Element => {
  return (
    <Card sx={{ width: 350, height: '100%' }}>
      <CardActionArea
        sx={{ height: '100%' }}
        href={`https://www.senscritique.com/top/resultats/slug/${props.id}`}
        target="_blank"
      >
        <CardMedia component="img" height="140" image={props.cover} alt={props.name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})
