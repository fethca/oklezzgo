import { IMovie, ITmdb, tmdbSchemaFormat } from '@fethcat/shared/types'
import * as validator from 'validator'
import { IFilterOption } from './types.js'

export function convertToHours(value: number, separator = ':', trail = '') {
  const date: Date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setSeconds(value)
  const hours = date.getHours()
  if (hours >= 5) return '∞'
  return `${hours}${separator}${date.getMinutes()}${trail}`
}

export function formatTmdb(tmdb: ITmdb): ITmdb {
  const formattedTmdb = tmdbSchemaFormat.parse(tmdb)
  return formattedTmdb
}

export function formatOptions(movie: IMovie): IFilterOption {
  return {
    name: `${movie.senscritique.title} ${formatDate(movie.senscritique.dateRelease)}`,
    id: movie.id,
  }
}

function formatDate(date: string | null) {
  const year = date?.slice(0, 4) || ''
  return year && `(${year})`
}

export function formatPosterSC(url?: string) {
  if (!url) return ''
  return url.replace(/\/0\//, '/300/')
}

export function validateAlphanumeric(value: string) {
  if (!value) return true
  const result = validator.isAlphanumeric(value.replace(/\s+/g, ''), 'en-US', { ignore: '_-*!@' })
  return result
}
