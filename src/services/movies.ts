import { IMovie, ITmdb } from '@fethcat/shared/types'
import axios from 'axios'
import { apiUrl, defaultFilters } from '../constants.js'
import { IFilterOption, IFilters, IFormattedFilters, filterFormatter } from '../types.js'

const comparisonKeys = ['rating', 'dateRelease', 'duration', 'popularity', 'seed']
type IFormattedEntries = [keyof IFormattedFilters, IFormattedFilters[keyof IFormattedFilters]][]

function formatUrl(filters: IFormattedFilters) {
  //Todo with ifs min & max by default then no filters instead of huge range filters ?
  let url = `${apiUrl}/movies?`
  for (const [key, value] of Object.entries(filters) as IFormattedEntries) {
    if (value === defaultFilters[key] && !['categories', 'released'].includes(key)) continue
    if (key === 'sortValue') url = url.concat(`sortValue=${value !== 'tmdb' ? value : 'tmdb.popularity'}&`)
    else if (comparisonKeys.includes(key)) url = url.concat(`${key}=${value.toString()}&${key}Order=gte,lte&`)
    else url = url.concat(`${key}=${value.toString()}&`)
  }
  return url
}

export async function getMovies({ pageParam, filters }: { pageParam: number; filters: IFilters }): Promise<IMovie[]> {
  const formattedFilter = filterFormatter.parse(filters)
  const url = formatUrl(formattedFilter)
  const { data } = await axios.get(`${url}pageSize=100&pageIndex=${pageParam}`)
  const { movies } = data
  return movies
}

export async function getRandomMovie({ filters }: { filters: IFilters }): Promise<IMovie> {
  const formattedFilter = filterFormatter.parse(filters)
  const url = formatUrl(formattedFilter)
  const { data } = await axios.get(`${url}random=true`)
  const { movies } = data
  return movies[0]
}

export async function getMovie({ id }: { id: number }): Promise<IMovie> {
  const url = `${apiUrl}/movies/${id}?`
  const { data } = await axios.get(url)
  const { movie } = data
  return movie
}

export async function getTMDB(search: string): Promise<ITmdb[]> {
  if (!search) return []
  const url = `${apiUrl}/tmdb?search=${search}`
  const { data } = await axios.get(url)
  const { tmdb } = data
  return tmdb
}

export async function getDirectors({ pageSize } = { pageSize: 300 }): Promise<IFilterOption[]> {
  const url = `${apiUrl}/directors?pageSize=${pageSize}`
  const { data } = await axios.get(url)
  const { directors } = data
  return directors
}

export async function getActors({ pageSize } = { pageSize: 300 }): Promise<IFilterOption[]> {
  const url = `${apiUrl}/actors?pageSize=${pageSize}`
  const { data } = await axios.get(url)
  const { actors } = data
  return actors
}

export async function getPolls({ pageSize } = { pageSize: 300 }): Promise<IFilterOption[]> {
  const url = `${apiUrl}/polls?pageSize=${pageSize}`
  const { data } = await axios.get(url)
  const { polls } = data
  return polls
}

export async function getCategories(): Promise<string[]> {
  const url = `${apiUrl}/categories`
  const { data } = await axios.get(url)
  const { categories } = data
  return categories
}

export async function getCountries(): Promise<string[]> {
  const url = `${apiUrl}/countries`
  const { data } = await axios.get(url)
  const { countries } = data
  return countries
}

export async function getGenres({ source }: { source: 'senscritique' | 'tmdb' }): Promise<string[]> {
  const url = `${apiUrl}/genres?source=${source}`
  const { data } = await axios.get(url)
  const { genres } = data
  return genres
}

export async function getMovieList(search: string): Promise<IMovie[]> {
  if (!search) return []
  const url = `${apiUrl}/list?search=${search}`
  const { data } = await axios.get(url)
  const { list } = data
  return list
}

export async function searchDirectors(search: string): Promise<IFilterOption[]> {
  if (!search) return []
  const url = `${apiUrl}/directors/search?search=${search}`
  const { data } = await axios.get(url)
  const { list } = data
  return list
}

export async function searchActors(search: string): Promise<IFilterOption[]> {
  if (!search) return []
  const url = `${apiUrl}/actors/search?search=${search}`
  const { data } = await axios.get(url)
  const { list } = data
  return list
}

export async function searchPolls(search: string): Promise<IFilterOption[]> {
  if (!search) return []
  const url = `${apiUrl}/polls/search?search=${search}`
  const { data } = await axios.get(url)
  const { list } = data
  return list
}

export async function updateMovie(id: number, data: Omit<IMovie, 'opsDatas'>): Promise<boolean> {
  const url = `${apiUrl}/movies/${id}`
  try {
    const { status } = await axios.put<Response>(url, { movie: data })
    return status === 200
  } catch (error) {
    return false
  }
}
