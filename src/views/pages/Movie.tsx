import { IMovie } from '@fethcat/shared/types'
import { AddCircle, ArrowRight } from '@mui/icons-material'
import { IconProps } from '@mui/material'
import { ReactElement, memo, useMemo } from 'react'
import { formatPosterSC } from '../../utils.js'
import { CardFooter } from '../components/CardFooter.js'
import { CardSmall } from '../components/CardSmall.js'

function getImage(movie: IMovie, filter: string) {
  if (filter === 'tmdb' && movie.tmdb && movie.tmdb.images)
    return movie.tmdb.images[0]?.replace('original', 'w220_and_h330_face')
  if (filter === 'senscritique') return formatPosterSC(movie.senscritique.pictures.posters[0])
  if (filter === 'random' && movie.senscritique.pictures.posters.length > 1) {
    const random = Math.floor(Math.random() * movie.senscritique.pictures.posters.length)
    return formatPosterSC(movie.senscritique.pictures.posters[random])
  }
  return formatPosterSC(movie.senscritique.pictures.posters[0])
}

function formatLink(id: string) {
  return `https://www.google.com/search?q=${id}`
}

type IMovieProps = {
  movie: IMovie
  image: string
  openDialog: (movie: IMovie) => () => void
  select: (value: IMovie) => void
  SecondIcon?: ReactElement<IconProps>
}

const Movie = memo(({ movie, image, openDialog, select, SecondIcon }: IMovieProps): JSX.Element => {
  const cover = useMemo(() => {
    return getImage(movie, image)
  }, [movie, image])

  return (
    <>
      <CardSmall
        key={movie.id}
        cover={cover}
        label={movie.senscritique.title}
        subLabel={movie.senscritique.dateRelease?.slice(0, 4)}
        labelAction={openDialog(movie)}
        Icon={<ArrowRight sx={{ fontSize: 100 }} />}
        iconAction={() => window.open(formatLink(movie.senscritique.title), `_self`)}
        OverlayFooter={<CardFooter rating={movie.senscritique.rating || 0} />}
        SecondIcon={SecondIcon || <AddCircle />}
        secondIconAction={() => select(movie)}
      ></CardSmall>
    </>
  )
})

Movie.displayName = 'Movie'
export { Movie }
