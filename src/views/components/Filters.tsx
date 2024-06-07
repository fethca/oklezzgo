import { IMovie } from '@fethcat/shared/types'
import { Cancel, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, memo, useCallback, useEffect, useState } from 'react'
import { currentYear, defaultFilters, staleTime } from '../../constants.js'
import {
  getActors,
  getCategories,
  getCountries,
  getDirectors,
  getGenres,
  getMovieList,
  getPolls,
  searchActors,
  searchDirectors,
  searchPolls,
} from '../../services/movies.js'
import { IFilterOption, IFilters, isFilterOptions } from '../../types.js'
import { convertToHours, formatOptions } from '../../utils.js'
import { AutoCompleteLabelChip } from './AutocompleteLabelChip.js'
import { BasicSelect } from './BasicSelect.js'
import { MultiSelectLabelsChip } from './MultiSelectLabelChip.js'
import { RangeSlider } from './RangeSlider.js'

type IFiltersProps = {
  filters: IFilters
  setFilters: Dispatch<SetStateAction<IFilters>>
  moviesSelected: IMovie[]
  setMoviesSelected: Dispatch<SetStateAction<IMovie[]>>
}

export const Filters = memo(
  ({ filters, setFilters, moviesSelected, setMoviesSelected }: IFiltersProps): JSX.Element => {
    const [movieOptions, setMovieOptions] = useState<readonly IMovie[]>([])
    const [directorOptions, setDirectorOptions] = useState<IFilterOption[]>([])
    const [actorOptions, setActorOptions] = useState<IFilterOption[]>([])
    const [pollOptions, setPollOptions] = useState<IFilterOption[]>([])
    const [movieSearch, setMovieSearch] = useState('')
    const [directorSearch, setDirectorSearch] = useState<string>('')
    const [actorSearch, setActorSearch] = useState<string>('')
    const [pollSearch, setPollSearch] = useState<string>('')

    const { data: directors } = useQuery({
      queryKey: ['directors'],
      queryFn: () => getDirectors({ pageSize: 300 }),
      staleTime,
    })

    const { data: actors } = useQuery({
      queryKey: ['actors'],
      queryFn: () => getActors({ pageSize: 300 }),
      staleTime,
    })

    const { data: polls } = useQuery({
      queryKey: ['polls'],
      queryFn: () => getPolls({ pageSize: 300 }),
      staleTime,
    })

    useEffect(() => {
      if (directors) setDirectorOptions(directors)
    }, [directors])

    useEffect(() => {
      if (actors) setActorOptions(actors)
    }, [actors])

    useEffect(() => {
      if (polls) setPollOptions(polls)
    }, [polls])

    const handleDirectorSearch = (_event: SyntheticEvent, value: string) => {
      if (!value && directors) setDirectorOptions(directors)
      else setDirectorSearch(value)
    }

    const filterSelectionChange = (property: 'directors' | 'actors' | 'polls') => {
      return (_event: SyntheticEvent, values: (string | IFilterOption)[]) => {
        if (!isFilterOptions(values)) return
        if (values.length < filters[property].length) unselect(property, values)
        else select(property, values[values.length - 1])
      }
    }

    const unselect = (property: 'directors' | 'actors' | 'polls', values: IFilterOption[]) => {
      const newSelection = filters[property].filter((selected) => values.find((value) => value.id === selected.id))
      const newFilters = { ...filters, [property]: newSelection }
      setFilters(newFilters)
    }

    const select = (property: 'directors' | 'actors' | 'polls', value: IFilterOption) => {
      const newSelection = [...filters[property]]
      if (value && !newSelection.find(({ id }) => id === value.id)) newSelection.push(value)
      const newFilters = { ...filters, [property]: newSelection }
      setFilters(newFilters)
    }

    const { data: directorSearchResult } = useQuery({
      queryKey: ['directorList', directorSearch],
      queryFn: () => searchDirectors(directorSearch),
    })

    useEffect(() => {
      if (directorSearchResult) setDirectorOptions(directorSearchResult)
    }, [directorSearchResult])

    const handleActorSearch = (_event: SyntheticEvent, value: string) => {
      if (!value && actors) setActorOptions(actors)
      else setActorSearch(value)
    }

    const { data: actorSearchResult } = useQuery({
      queryKey: ['actorList', actorSearch],
      queryFn: () => searchActors(actorSearch),
    })

    useEffect(() => {
      if (actorSearchResult) setActorOptions(actorSearchResult)
    }, [actorSearchResult])

    const handlePollSearch = (_event: SyntheticEvent, value: string) => {
      if (!value && polls) setPollOptions(polls)
      else setPollSearch(value)
    }

    const { data: pollSearchResult } = useQuery({
      queryKey: ['pollList', pollSearch],
      queryFn: () => searchPolls(pollSearch),
    })

    useEffect(() => {
      if (pollSearchResult) setPollOptions(pollSearchResult)
    }, [pollSearchResult])

    const categories = useQuery({
      queryKey: ['categories'],
      queryFn: () => getCategories(),
      staleTime,
    })

    const countries = useQuery({
      queryKey: ['countries'],
      queryFn: () => getCountries(),
      staleTime,
    })

    const genres = useQuery({
      queryKey: ['genres'],
      queryFn: () => getGenres({ source: 'senscritique' }),
      staleTime,
    })

    const { data: movieList } = useQuery({
      queryKey: ['movieList', movieSearch],
      queryFn: () => getMovieList(movieSearch),
      staleTime,
    })

    const handleReset = useCallback(() => {
      setFilters(defaultFilters)
    }, [filters])

    const toggleReleased = (event: ChangeEvent<HTMLInputElement>) => {
      const newFilters = { ...filters, released: event.target.checked }
      setFilters(newFilters)
    }

    const handleMovieSearch = (_event: SyntheticEvent, value: string) => {
      setMovieSearch(value)
    }

    const movieSelectionChange = (_event: SyntheticEvent, values: (string | IFilterOption)[]) => {
      if (!isFilterOptions(values)) return
      if (values.length < moviesSelected.length) unselectMovie(values)
      else selectMovie(values[values.length - 1])
    }

    const unselectMovie = (movies: IFilterOption[]) => {
      const filtered = moviesSelected.filter((selected) => movies.find((movie) => movie.id === selected.id))
      setMoviesSelected(filtered)
    }

    const selectMovie = (movie: IFilterOption) => {
      const newSelection = [...moviesSelected]
      const selected = movieOptions.find((selected) => selected.id === movie.id)
      if (selected) newSelection.push(selected)
      setMoviesSelected(newSelection)
    }

    useEffect(() => {
      if (movieList) setMovieOptions(movieList)
    }, [movieList])

    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <h2>Filtres</h2>
        </AccordionSummary>
        <AccordionDetails className="accordion">
          <div className="filters">
            <RangeSlider
              label="Note"
              name="rating"
              min={0}
              max={10}
              step={0.1}
              filters={filters}
              setFilters={setFilters}
              filterValues={filters.rating}
            ></RangeSlider>
            <RangeSlider
              label="Année"
              name="dateRelease"
              min={1896}
              max={currentYear}
              step={1}
              filters={filters}
              setFilters={setFilters}
              filterValues={filters.dateRelease}
            ></RangeSlider>
            <RangeSlider
              label="Durée"
              name="duration"
              min={0}
              max={18000}
              step={60}
              filters={filters}
              setFilters={setFilters}
              convertLabel={true}
              convertLabelFn={convertToHours}
              filterValues={filters.duration}
            ></RangeSlider>
            <RangeSlider
              label="Popularité"
              name="popularity"
              min={0}
              max={30}
              step={0.1}
              filters={filters}
              setFilters={setFilters}
              filterValues={filters.popularity}
            ></RangeSlider>
            <MultiSelectLabelsChip
              name="categories"
              filters={filters}
              data={categories.data?.map((category, index) => ({ label: category, id: index })) || []}
              setFilters={setFilters}
              label="Catégories"
              values={filters.categories}
            ></MultiSelectLabelsChip>
            <MultiSelectLabelsChip
              name="countries"
              filters={filters}
              data={countries.data?.map((country, index) => ({ label: country, id: index })) || []}
              setFilters={setFilters}
              label="Pays"
              values={filters.countries}
            ></MultiSelectLabelsChip>
            <MultiSelectLabelsChip
              name="genres"
              filters={filters}
              data={genres.data?.map((genre, index) => ({ label: genre, id: index })) || []}
              setFilters={setFilters}
              label="Genres"
              values={filters.genres}
            ></MultiSelectLabelsChip>
            <BasicSelect
              label="Tri"
              name="sortValue"
              value={filters.sortValue}
              items={[
                { label: 'Note', value: 'senscritique.rating' },
                { label: 'Année', value: 'senscritique.dateRelease' },
                { label: 'Durée', value: 'senscritique.duration' },
                { label: 'Popularité Senscritique', value: 'popularity' },
                { label: 'Popularité TMDB', value: 'tmdb.popularity' },
              ]}
              filters={filters}
              setFilters={setFilters}
            ></BasicSelect>
            <BasicSelect
              label="Ordre"
              name="sortOrder"
              value={filters.sortOrder}
              items={[
                { label: 'Ascendant', value: 'asc' },
                { label: 'Descendant', value: 'desc' },
              ]}
              filters={filters}
              setFilters={setFilters}
            ></BasicSelect>
            <BasicSelect
              label="Image"
              name="image"
              value={filters.image}
              items={[
                { label: 'Senscritique', value: 'senscritique' },
                { label: 'TMDB', value: 'tmdb' },
                { label: 'Random', value: 'random' },
              ]}
              filters={filters}
              setFilters={setFilters}
            ></BasicSelect>
            <FormGroup>
              <FormControlLabel
                control={<Switch id="switch-released" checked={filters.released} onChange={toggleReleased} />}
                label="Dispo"
              />
            </FormGroup>
            <AutoCompleteLabelChip
              options={directorOptions}
              label="Réalisateurs"
              value={filters.directors}
              onInputChange={handleDirectorSearch}
              onChange={filterSelectionChange('directors')}
            />
            <AutoCompleteLabelChip
              options={actorOptions}
              label="Acteurs"
              value={filters.actors}
              onInputChange={handleActorSearch}
              onChange={filterSelectionChange('actors')}
            />
            <AutoCompleteLabelChip
              options={pollOptions}
              label="Tops"
              value={filters.polls}
              onInputChange={handlePollSearch}
              onChange={filterSelectionChange('polls')}
            />
            <Button onClick={handleReset} className="filter" variant="outlined" startIcon={<Cancel />}>
              Reset
            </Button>
            <AutoCompleteLabelChip
              options={movieOptions.map((movie) => formatOptions(movie))}
              label="Sélection"
              value={moviesSelected.map((movie) => formatOptions(movie))}
              onInputChange={handleMovieSearch}
              onChange={movieSelectionChange}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    )
  },
)
