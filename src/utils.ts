import { ITmdb, tmdbSchemaFormat } from '@fethcat/shared/types'

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

export function getYear(date: string | null) {
  if (!date) return ''
  return date.slice(0, 4)
}

export function formatOption(date: string | null) {
  const year = getYear(date)
  return year && `(${year})`
}

export function formatPosterSC(url?: string) {
  if (!url) return ''
  return url.replace(/\/0\//, '/300/')
}
