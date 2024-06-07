import { IMovie, ITmdb } from '@fethcat/shared/types'
import { Beenhere, Bookmark, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { common, green } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Dispatch, FormEvent, SetStateAction, memo, useEffect, useRef, useState } from 'react'
import { defaultFilters, staleTime } from '../../constants.js'
import { getMovie, getTMDB, updateMovie } from '../../services/movies.js'
import { IFilterOption, IFilters, isFilterOption, isFilterOptions } from '../../types.js'
import { convertToHours, formatPosterSC } from '../../utils.js'
import { AccordionForm } from '../components/AccordionForm.js'
import { CardFooter } from '../components/CardFooter.js'
import { CardSmall } from '../components/CardSmall.js'
import { CardWide } from '../components/CardWide.js'
import { DataTable } from '../components/DataTable.js'
import { EmblaCarousel } from '../components/EmblaCarousel.js'

type IDetailProps = {
  open: boolean
  loading: boolean
  initMovie: Omit<IMovie, 'opsDatas'>
  refreshList: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
  filters: IFilters
  setFilters: Dispatch<SetStateAction<IFilters>>
}

interface SearchForm extends HTMLFormElement {
  searchInput: HTMLInputElement
}

const formatSCUrl = (target: string) => {
  return `https://www.senscritique.com/film/${target}`
}

const ratingUrls: Record<string, string> = {
  rottenTomatoes: 'https://www.rottentomatoes.com/search?search=',
  tmdb: 'https://www.themoviedb.org/movie/',
  imdb: 'https://www.imdb.com/title/',
  metacritic: 'https://www.metacritic.com/search/',
}

const resolveUrl = (key: string, tmdb?: ITmdb): string => {
  const baseUrl = ratingUrls[key] || 'https://www.google.com/search?q='
  let url = baseUrl + tmdb?.title
  if (key === 'imdb') url = baseUrl + tmdb?.imdbId
  if (key === 'tmdb') url = baseUrl + tmdb?.tmdbId
  return url
}

function openTab(url: string) {
  window.open(url, '_blank', 'noreferrer')
}

function getBookmark(movie: Omit<IMovie, 'opsDatas'>, tmdb: ITmdb) {
  if (movie.tmdb && movie.tmdb.tmdbId === tmdb.tmdbId) return <Bookmark sx={{ color: green['500'] }} />
  return <></>
}

function getActorImage(url: string) {
  if (url === 'https://media.senscritique.com/missing/212/120/missing.jpg') return '/assets/posterholder.png'
  return url
}

export const Detail = memo(({ open, loading, initMovie, refreshList, setOpen, filters, setFilters }: IDetailProps) => {
  const [tmdbSearch, setTMDBSearch] = useState<string>('')
  const loadingRef = useRef<HTMLDivElement>(null)
  // const { showSnackBar } = useSnackBar()

  const { data: movie, refetch: refreshMovie } = useQuery({
    initialData: initMovie,
    queryKey: ['movie', initMovie],
    queryFn: () => getMovie({ id: initMovie.id }),
    staleTime,
  })

  const { isLoading: searchTMDBLoading, data: searchTMDB } = useQuery({
    queryKey: ['tmdb', tmdbSearch],
    queryFn: () => getTMDB(tmdbSearch),
    staleTime,
  })

  const selectOption = (
    property: 'directors' | 'actors' | 'polls' | 'genres' | 'countries',
    value: IFilterOption | string,
  ) => {
    const newSelection = [...filters[property]]
    if (isFilterOption(value) && isFilterOptions(newSelection)) {
      if (!newSelection.find(({ id }) => id === value.id)) newSelection.push(value)
    } else newSelection.push(value)
    const newFilters = { ...defaultFilters, [property]: newSelection }
    setFilters(newFilters)
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setTMDBSearch('')
    }, 1000)
  }

  const handleFavorite = async (tmdb: ITmdb) => {
    const body = { ...movie, tmdb: { ...tmdb, searchQuery: tmdb.tmdbId } }
    await updateMovie(movie.id, body)
    refreshMovie()
    refreshList()
  }

  const handleSearchTMDB = async (event: FormEvent<SearchForm>) => {
    event.preventDefault()
    setTMDBSearch(event.currentTarget.searchInput.value)
  }

  useEffect(() => {
    if (!loading && open && movie.tmdb) setTMDBSearch(movie.tmdb.title)
  }, [movie])

  if (loading) {
    return (
      <Dialog fullWidth={true} maxWidth={'lg'} className="dialog" open={open} onClose={handleClose} scroll="paper">
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '37vh 0' }}>
          <CircularProgress />
        </Box>
      </Dialog>
    )
  }

  return (
    <Dialog fullWidth={true} maxWidth={'lg'} className="dialog" open={open} onClose={handleClose} scroll="paper">
      <>
        <DialogTitle className="dialog__title">
          <span>{movie.senscritique.title}</span>
          <span style={{ fontWeight: 100, fontStyle: 'italic' }}>{movie.senscritique.originalTitle}</span>
        </DialogTitle>
        <DialogContent dividers={true} sx={{ overflowY: 'scroll' }}>
          <div className="detail__infos">
            <div className="image-wrapper">
              <img src={formatPosterSC(movie.senscritique.pictures.posters[0]) || 'posterholder.png'}></img>
            </div>
            <div className="detail__infos-text">
              <div>
                <div>{movie.senscritique.synopsis}</div>
                <h4>Réalisateurs</h4>
                {movie.senscritique.directors.map(({ id, name }) => (
                  <Chip
                    key={id}
                    className="chip"
                    label={name}
                    onClick={() => selectOption('directors', { id, name })}
                  ></Chip>
                ))}
              </div>
              <div>
                <h4>Genres</h4>
                {movie.senscritique.genresInfos.map((genre) => (
                  <Chip key={genre} className="chip" label={genre} onClick={() => selectOption('genres', genre)}></Chip>
                ))}
              </div>
              <div>
                <h4>Pays</h4>
                {movie.senscritique.countries.map((country) => (
                  <Chip
                    key={country}
                    className="chip"
                    label={country}
                    onClick={() => selectOption('countries', country)}
                  ></Chip>
                ))}
              </div>
              <div className="divers">
                <span>
                  {movie.senscritique.duration ? convertToHours(movie.senscritique.duration, ' h ', ' min') : ''}
                </span>
                <span>{dayjs(movie.senscritique.dateRelease).format('MMMM YYYY')}</span>
                <span className="rating" onClick={() => openTab(formatSCUrl(`${movie.senscritique.slug}/${movie.id}`))}>
                  <img className="logo" src="/assets/senscritique.svg"></img> {movie.senscritique.rating}
                </span>
                {movie.tmdb &&
                  Object.entries(movie.tmdb.ratings).map(([key, rating]) => (
                    <span key={key} className="rating" onClick={() => openTab(resolveUrl(key, movie.tmdb))}>
                      <img className="logo" src={`/assets/${key}.svg`}></img> {rating.value}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <h3>Casting</h3>
            <div className="detail__actors">
              {movie.senscritique.actors.map(({ actor, role }) => (
                <div key={actor.id} className="detail__actors-item">
                  <div className="image-wrapper">
                    <img src={getActorImage(actor.picture)}></img>
                  </div>
                  <span
                    onClick={() => selectOption('actors', { id: actor.id, name: actor.name })}
                    className="detail__actors-item__name"
                  >
                    {actor.name}
                  </span>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {movie.senscritique.polls?.length > 0 && (
              <>
                <h3>Tops</h3>
                <div style={{ display: 'block' }}>
                  <EmblaCarousel
                    Slide={CardWide}
                    slides={
                      movie.senscritique.polls.map((poll) => ({
                        ...poll,
                        onClick: () => selectOption('polls', { id: poll.id, name: poll.name }),
                      })) || []
                    }
                    options={{ dragFree: true, containScroll: 'trimSnaps' }}
                  />
                </div>
              </>
            )}
          </div>
          <h3>TMDB</h3>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>Recherche</AccordionSummary>
            <AccordionDetails className="accordion">
              <AccordionForm
                buttonLabel="Rechercher"
                inputLabel="Titre TMDB"
                defaultValue={tmdbSearch || movie.senscritique.title}
                formAction={handleSearchTMDB}
              ></AccordionForm>
              <div>
                <div style={{ display: 'block' }}>
                  {searchTMDBLoading || !searchTMDB ? (
                    <Box ref={loadingRef} sx={{ display: 'flex', justifyContent: 'center', margin: '150px 0' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <EmblaCarousel
                      slides={searchTMDB.map((tmdb) => ({
                        Bookmark: getBookmark(movie, tmdb),
                        cover: tmdb.images && tmdb.images[0] && tmdb.images[0].replace('original', 'w300'),
                        label: tmdb.title,
                        subLabel: tmdb.year.toString(),
                        labelAction: () => window.open(`https://themoviedb.org/movie/${tmdb.tmdbId}`, `_blank`),
                        Icon: <Beenhere sx={{ color: common['white'], width: '50px', height: '50px' }} />,
                        iconAction: () => handleFavorite(tmdb),
                        OverlayFooter: <CardFooter rating={tmdb.ratings['tmdb'].value} />,
                      }))}
                      options={{ dragFree: true, containScroll: 'trimSnaps' }}
                      Slide={CardSmall}
                    />
                  )}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <h3>Sources</h3>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>Actuels</AccordionSummary>
            <AccordionDetails className="accordion">
              <DataTable
                movie={movie}
                pageSize={movie.providers.length}
                rows={movie.providers}
                handleUpdate={refreshMovie}
              ></DataTable>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </>
    </Dialog>
  )
})
