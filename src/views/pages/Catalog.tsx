import { IMovie } from '@fethcat/shared/types'
import { memo, useState } from 'react'
import { defaultFilters } from '../../constants.js'
import { IFilters } from '../../types.js'
import { Filters } from '../components/Filters.js'
import { Movies } from './Movies.js'

export const Catalog = memo((): JSX.Element => {
  const [filters, setFilters] = useState<IFilters>(defaultFilters)
  const [moviesSelected, setMoviesSelected] = useState<IMovie[]>([])

  return (
    <div className="catalog">
      <Filters
        filters={filters}
        onFiltersChange={setFilters}
        moviesSelected={moviesSelected}
        setMoviesSelected={setMoviesSelected}
      ></Filters>
      <Movies filters={filters} selectedMovies={moviesSelected} setSelectedMovies={setMoviesSelected}></Movies>
    </div>
  )
})
