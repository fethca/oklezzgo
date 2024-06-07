import { IMovie } from '@fethcat/shared/types'
import { Cancel, Shuffle } from '@mui/icons-material'
import { Button } from '@mui/material'
import { common } from '@mui/material/colors'
import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { dummyMovie, staleTime } from '../../constants.js'
import { useSnackBar } from '../../contexts/SnackbarContext.js'
import { getMovies, getRandomMovie } from '../../services/movies.js'
import { IFilters } from '../../types.js'
import { CardsSkeleton } from '../components/Skeleton.js'
import { Detail } from './Detail.js'
import { Movie } from './Movie.js'

type IMoviesProps = {
  filters: IFilters
  setFilters: Dispatch<SetStateAction<IFilters>>
  moviesSelected: IMovie[]
  setMoviesSelected: Dispatch<SetStateAction<IMovie[]>>
}

const Movies = memo(({ filters, setFilters, moviesSelected, setMoviesSelected }: IMoviesProps): JSX.Element => {
  const { ref, inView } = useInView()
  const { showSnackBar } = useSnackBar()

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailMovie, setDetailMovie] = useState<IMovie>()

  const {
    data: movies,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch: refreshList,
  } = useInfiniteQuery({
    queryKey: ['movies', filters],
    queryFn: ({ pageParam }) => getMovies({ pageParam, filters }),
    initialPageParam: 0,
    staleTime,
    // maxPages: 3, //TODO for performance improvment : see doc, need to set getNext AND getPrevious otherwise buggy
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined
      return nextPage
    },
  })

  const openDialog = useCallback(
    (movie: IMovie) => () => {
      setDetailMovie(movie)
      setDetailOpen(true)
    },
    [],
  )

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const {
    isLoading: randomizeMovieLoading,
    data: randomizedMovie,
    refetch: randomizeMovie,
  } = useQuery({
    queryKey: ['random'],
    queryFn: () => getRandomMovie({ filters }),
    enabled: false,
  })

  useEffect(() => {
    if (randomizedMovie && !randomizeMovieLoading) {
      setDetailMovie(randomizedMovie)
      setDetailLoading(false)
    }
  }, [randomizedMovie, randomizeMovieLoading])

  const select = (value: IMovie) => {
    const newSelection = [...moviesSelected]
    const index = newSelection.findIndex((movie) => movie.id === value.id)
    if (index !== -1) {
      newSelection.splice(index, 1)
      showSnackBar(`${value.senscritique.title} retiré`, 'success', 3000)
    } else {
      newSelection.push(value)
      showSnackBar(`${value.senscritique.title} ajouté`, 'success', 3000)
    }
    setMoviesSelected(newSelection)
  }

  const onRandomSelection = () => {
    const movie = moviesSelected[Math.floor(Math.random() * moviesSelected.length)]
    setDetailMovie(movie)
    setDetailOpen(true)
  }

  const onRandom = () => {
    setDetailLoading(true)
    randomizeMovie()
    setDetailOpen(true)
  }

  return (
    <>
      {moviesSelected.length !== 0 && (
        <div className="catalog-selection">
          <div className="catalog-list__header">
            <h1>Sélection</h1>
            <Button onClick={onRandomSelection} sx={{ color: common['white'] }} startIcon={<Shuffle />}>
              Aléatoire
            </Button>
          </div>
          <div className="movie-list">
            {moviesSelected.map((movie: IMovie) => (
              <Movie
                key={movie.id}
                movie={movie}
                image={filters.image || 'tmdb'}
                openDialog={openDialog}
                select={select}
                SecondIcon={<Cancel />}
              ></Movie>
            ))}
          </div>
        </div>
      )}
      <div className="catalog-list">
        <div className="catalog-list__header">
          <h1>Résultats</h1>
          <Button onClick={onRandom} sx={{ color: common['white'] }} startIcon={<Shuffle />}>
            Aléatoire
          </Button>
        </div>
        <div className="movie-list">
          <Container
            filters={filters}
            movies={movies}
            openDialog={openDialog}
            select={select}
            selection={moviesSelected}
            status={status}
            error={error}
          ></Container>
          {isFetchingNextPage && <CardsSkeleton />}
        </div>
      </div>
      <div style={{ position: 'relative', opacity: 0, zIndex: -1 }}>
        <span style={{ position: 'absolute', top: '-2000px' }} ref={ref}></span>
      </div>
      <Detail
        initMovie={detailMovie || dummyMovie}
        open={detailOpen}
        loading={detailLoading}
        refreshList={refreshList}
        setOpen={setDetailOpen}
        filters={filters}
        setFilters={setFilters}
      ></Detail>
    </>
  )
})

type IContainerProps = {
  filters: IFilters
  movies?: InfiniteData<IMovie[]>
  openDialog: (movie: IMovie) => () => void
  select: (value: IMovie) => void
  selection: IMovie[]
  status: 'error' | 'success' | 'pending'
  error: Error | null
}

const Container = memo(
  ({ filters, movies, selection, openDialog, select, status, error }: IContainerProps): JSX.Element => {
    if (status === 'pending') return <CardsSkeleton />
    if (status === 'error') return <p>Error: {error?.message}</p>
    if (!movies || movies.pages.length === 0) return <p>No data</p>

    return (
      <>
        {movies.pages.map((movies: IMovie[]) =>
          movies.map((movie: IMovie) => (
            <Movie
              key={movie.id}
              movie={movie}
              image={filters.image || 'tmdb'}
              openDialog={openDialog}
              select={select}
              SecondIcon={selection.some((selected) => selected.id === movie.id) ? <Cancel /> : undefined}
            ></Movie>
          )),
        )}
      </>
    )
  },
)

Container.displayName = 'Container'
Movies.displayName = 'Movies'
export { Movies }
