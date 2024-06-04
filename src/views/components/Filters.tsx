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
import {
  currentYear,
  defaultActors,
  defaultCategories,
  defaultCountries,
  defaultDateRelease,
  defaultDirectors,
  defaultDuration,
  defaultFilters,
  defaultGenres,
  defaultImage,
  defaultPolls,
  defaultPopularity,
  defaultRating,
  defaultReleased,
  staleTime,
} from '../../constants.js'
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
import { IFilterOptions, IFilters } from '../../types.js'
import { convertToHours, formatOption, getYear } from '../../utils.js'
import { AutoCompleteLabelChip } from './AutocompleteLabelChip.js'
import { BasicSelect } from './BasicSelect.js'
import { MultiSelectLabelsChip } from './MultiSelectLabelChip.js'
import { RangeSlider } from './RangeSlider.js'

type IFiltersProps = {
  filters: IFilters
  onFiltersChange: Dispatch<SetStateAction<IFilters>>
  moviesSelected: IMovie[]
  setMoviesSelected: Dispatch<SetStateAction<IMovie[]>>
}

export const Filters = memo(
  ({ filters, onFiltersChange, moviesSelected, setMoviesSelected }: IFiltersProps): JSX.Element => {
    const [ratings, setRatings] = useState<number[]>(filters.rating)
    const [years, setYears] = useState<number[]>(filters.dateRelease)
    const [durations, setDurations] = useState<number[]>(filters.duration)
    const [popularity, setPopularity] = useState<number[]>(filters.popularity)
    const [directorsSelected, setDirectorsSelected] = useState<IFilterOptions[]>(filters.directors)
    const [actorsSelected, setActorsSelected] = useState<IFilterOptions[]>(filters.actors)
    const [pollsSelected, setPollsSelected] = useState<IFilterOptions[]>(filters.polls)
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>(filters.categories)
    const [genresSelected, setGenresSelected] = useState<string[]>(filters.genres)
    const [countriesSelected, setCountriesSelected] = useState<string[]>(filters.countries)
    const [sort, setSort] = useState(filters.sortValue)
    const [sortOrder, setSortOrder] = useState(filters.sortOrder)
    const [image, setImage] = useState<string>(filters.image)
    const [released, setReleased] = useState<boolean>(filters.released)
    const [movieOptions, setMovieOptions] = useState<readonly IMovie[]>([])
    const [movieSearch, setMovieSearch] = useState('')
    const [directorOptions, setDirectorOptions] = useState<readonly IFilterOptions[]>([])
    const [actorOptions, setActorOptions] = useState<readonly IFilterOptions[]>([])
    const [pollOptions, setPollOptions] = useState<readonly IFilterOptions[]>([])
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

    const directorSelectionChange = (_event: SyntheticEvent, values: string[]) => {
      if (values.length < directorsSelected.length) unselectDirector(values)
      else selectDirector(values[values.length - 1])
    }

    const unselectDirector = (values: string[]) => {
      const filtered = directorsSelected.filter((director) => values.find((value) => value === director.name))
      setDirectorsSelected(filtered)
    }

    const selectDirector = (value: string) => {
      const newSelection = [...directorsSelected]
      const selected = directorOptions.find((director) => director.name === value)
      if (selected) newSelection.push(selected)
      setDirectorsSelected(newSelection)
    }

    const { data: directorSearchResult } = useQuery({
      queryKey: ['directorList', directorSearch],
      queryFn: () => searchDirectors(directorSearch),
    })

    useEffect(() => {
      if (directorSearchResult) setDirectorOptions(directorSearchResult)
    }, [directorSearchResult])

    useEffect(() => {
      const newFilters = { ...filters, directors: directorsSelected }
      onFiltersChange(newFilters)
    }, [directorsSelected])

    const handleActorSearch = (_event: SyntheticEvent, value: string) => {
      if (!value && actors) setActorOptions(actors)
      else setActorSearch(value)
    }

    const actorSelectionChange = (_event: SyntheticEvent, values: string[]) => {
      if (values.length < actorsSelected.length) unselectActor(values)
      else selectActor(values[values.length - 1])
    }

    const unselectActor = (values: string[]) => {
      const filtered = actorsSelected.filter((actor) => values.find((value) => value === actor.name))
      setActorsSelected(filtered)
    }

    const selectActor = (value: string) => {
      const newSelection = [...actorsSelected]
      const selected = actorOptions.find((actor) => actor.name === value)
      if (selected) newSelection.push(selected)
      setActorsSelected(newSelection)
    }

    const { data: actorSearchResult } = useQuery({
      queryKey: ['actorList', actorSearch],
      queryFn: () => searchActors(actorSearch),
    })

    useEffect(() => {
      if (actorSearchResult) setActorOptions(actorSearchResult)
    }, [actorSearchResult])

    useEffect(() => {
      const newFilters = { ...filters, actors: actorsSelected }
      onFiltersChange(newFilters)
    }, [actorsSelected])

    const handlePollSearch = (_event: SyntheticEvent, value: string) => {
      if (!value && polls) setPollOptions(polls)
      else setPollSearch(value)
    }

    const pollSelectionChange = (_event: SyntheticEvent, values: string[]) => {
      if (values.length < pollsSelected.length) unselectPoll(values)
      else selectPoll(values[values.length - 1])
    }

    const unselectPoll = (values: string[]) => {
      const filtered = pollsSelected.filter((poll) => values.find((value) => value === poll.name))
      setPollsSelected(filtered)
    }

    const selectPoll = (value: string) => {
      const newSelection = [...pollsSelected]
      const selected = pollOptions.find((poll) => poll.name === value)
      if (selected) newSelection.push(selected)
      setPollsSelected(newSelection)
    }

    const { data: pollSearchResult } = useQuery({
      queryKey: ['pollList', pollSearch],
      queryFn: () => searchPolls(pollSearch),
    })

    useEffect(() => {
      if (pollSearchResult) setPollOptions(pollSearchResult)
    }, [pollSearchResult])

    useEffect(() => {
      const newFilters = { ...filters, polls: pollsSelected }
      onFiltersChange(newFilters)
    }, [pollsSelected])

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
      setRatings(defaultRating)
      setYears(defaultDateRelease)
      setDurations(defaultDuration)
      setPopularity(defaultPopularity)
      setDirectorsSelected(defaultDirectors)
      setActorsSelected(defaultActors)
      setPollsSelected(defaultPolls)
      setCategoriesSelected(defaultCategories)
      setGenresSelected(defaultGenres)
      setCountriesSelected(defaultCountries)
      setSort('tmdb')
      setSortOrder('')
      setImage(defaultImage)
      setReleased(defaultReleased)

      onFiltersChange(defaultFilters)
    }, [filters])

    const toggleReleased = (event: ChangeEvent<HTMLInputElement>) => {
      setReleased(event.target.checked)
      const newFilters = { ...filters, released: event.target.checked }
      onFiltersChange(newFilters)
    }

    const handleMovieSearch = (_event: SyntheticEvent, value: string) => {
      setMovieSearch(value)
    }

    const movieSearchChange = (_event: SyntheticEvent, values: string[]) => {
      if (values.length < moviesSelected.length) unselectMovie(values)
      else selectMovie(values[values.length - 1])
    }

    const unselectMovie = (values: string[]) => {
      const filtered = moviesSelected.filter((movie) =>
        values.find((value) => value === `${movie.senscritique.title} (${getYear(movie.senscritique.dateRelease)})`),
      )
      setMoviesSelected(filtered)
    }

    const selectMovie = (value: string) => {
      const newSelection = [...moviesSelected]
      const selected = movieOptions.find(
        (movie) => `${movie.senscritique.title} (${getYear(movie.senscritique.dateRelease)})` === value,
      )
      if (selected) newSelection.push(selected)
      setMoviesSelected(newSelection)
    }

    useEffect(() => {
      if (movieList) setMovieOptions(movieList)
    }, [movieList])

    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>Filtres</AccordionSummary>
        <AccordionDetails className="accordion">
          <div className="filters">
            <RangeSlider
              label="Note"
              name="rating"
              min={0}
              max={10}
              step={0.1}
              filters={filters}
              onFiltersChange={onFiltersChange}
              values={ratings}
              setValues={setRatings}
            ></RangeSlider>
            <RangeSlider
              label="Année"
              name="dateRelease"
              min={1896}
              max={currentYear}
              step={1}
              filters={filters}
              onFiltersChange={onFiltersChange}
              values={years}
              setValues={setYears}
            ></RangeSlider>
            <RangeSlider
              label="Durée"
              name="duration"
              min={0}
              max={18000}
              step={60}
              filters={filters}
              onFiltersChange={onFiltersChange}
              convertLabel={true}
              convertLabelFn={convertToHours}
              values={durations}
              setValues={setDurations}
            ></RangeSlider>
            <RangeSlider
              label="Popularité"
              name="popularity"
              min={0}
              max={30}
              step={0.1}
              filters={filters}
              onFiltersChange={onFiltersChange}
              values={popularity}
              setValues={setPopularity}
            ></RangeSlider>
            <MultiSelectLabelsChip
              name="categories"
              filters={filters}
              data={categories.data?.map((category, index) => ({ label: category, id: index })) || []}
              onFiltersChange={onFiltersChange}
              label="Catégories"
              values={categoriesSelected}
              setValues={setCategoriesSelected}
            ></MultiSelectLabelsChip>
            <MultiSelectLabelsChip
              name="countries"
              filters={filters}
              data={countries.data?.map((country, index) => ({ label: country, id: index })) || []}
              onFiltersChange={onFiltersChange}
              label="Pays"
              values={countriesSelected}
              setValues={setCountriesSelected}
            ></MultiSelectLabelsChip>
            <MultiSelectLabelsChip
              name="genres"
              filters={filters}
              data={genres.data?.map((genre, index) => ({ label: genre, id: index })) || []}
              onFiltersChange={onFiltersChange}
              label="Genres"
              values={genresSelected}
              setValues={setGenresSelected}
            ></MultiSelectLabelsChip>
            <BasicSelect
              label="Tri"
              name="sortValue"
              value={sort}
              setValue={setSort}
              items={[
                { label: 'Note', value: 'rating' },
                { label: 'Année', value: 'dateRelease' },
                { label: 'Durée', value: 'duration' },
                { label: 'Popularité Senscritique', value: 'popularity' },
                { label: 'Popularité TMDB', value: 'tmdb' },
              ]}
              filters={filters}
              onFiltersChange={onFiltersChange}
            ></BasicSelect>
            <BasicSelect
              label="Ordre"
              name="sortOrder"
              value={sortOrder}
              setValue={setSortOrder}
              items={[
                { label: 'Ascendant', value: 'asc' },
                { label: 'Descendant', value: 'desc' },
              ]}
              filters={filters}
              onFiltersChange={onFiltersChange}
            ></BasicSelect>
            <BasicSelect
              label="Image"
              name="image"
              value={image}
              setValue={setImage}
              items={[
                { label: 'Senscritique', value: 'senscritique' },
                { label: 'TMDB', value: 'tmdb' },
                { label: 'Random', value: 'random' },
              ]}
              filters={filters}
              onFiltersChange={onFiltersChange}
            ></BasicSelect>
            <FormGroup>
              <FormControlLabel
                control={<Switch id="switch-released" checked={released} onChange={toggleReleased} />}
                label="Released"
              />
            </FormGroup>
            <AutoCompleteLabelChip
              options={movieOptions.map(
                (movie) => `${movie.senscritique.title} ${formatOption(movie.senscritique.dateRelease)}`,
              )}
              label="Sélection"
              value={moviesSelected.map(
                (movie) => `${movie.senscritique.title} ${formatOption(movie.senscritique.dateRelease)}`,
              )}
              onInputChange={handleMovieSearch}
              onChange={movieSearchChange}
            />
            <AutoCompleteLabelChip
              options={directorOptions.map((director) => director.name)}
              label="Réalisateurs"
              value={directorsSelected.map((director) => director.name)}
              onInputChange={handleDirectorSearch}
              onChange={directorSelectionChange}
            />
            <AutoCompleteLabelChip
              options={actorOptions.map((actor) => actor.name)}
              label="Acteurs"
              value={actorsSelected.map((actor) => actor.name)}
              onInputChange={handleActorSearch}
              onChange={actorSelectionChange}
            />
            <AutoCompleteLabelChip
              options={pollOptions.map((poll) => poll.name)}
              label="Tops"
              value={pollsSelected.map((poll) => poll.name)}
              onInputChange={handlePollSearch}
              onChange={pollSelectionChange}
            />
            <Button onClick={handleReset} className="filter" variant="outlined" startIcon={<Cancel />}>
              Reset
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    )
  },
)
