import { IMovie } from '@fethcat/shared/types'
import { IFilters } from './types.js'

export const currentYear = new Date().getFullYear()
export const defaultRating = [0, 10]
export const defaultDateRelease = [1896, currentYear]
export const defaultDuration = [0, 18000]
export const defaultPopularity = [0, 30]
export const defaultDirectors = []
export const defaultActors = []
export const defaultPolls = []
export const defaultCountries = []
export const defaultSortValue = 'tmdb.popularity'
export const defaultSortOrder = ''
export const defaultGenres = []
export const defaultCategories = [
  'Film',
  "Long-métrage d'animation",
  'Documentaire',
  'Film DTV (direct-to-video)',
  'Film VOD (vidéo à la demande)',
]
export const defaultImage = 'tmdb'
export const defaultReleased = true

export const staleTime = 1000 * 60 * 60

export const defaultFilters: IFilters = {
  categories: defaultCategories,
  countries: defaultCountries,
  dateRelease: defaultDateRelease,
  directors: defaultDirectors,
  actors: defaultActors,
  polls: defaultPolls,
  duration: defaultDuration,
  genres: defaultGenres,
  image: defaultImage,
  popularity: defaultPopularity,
  rating: defaultRating,
  released: defaultReleased,
  sortOrder: defaultSortOrder,
  sortValue: defaultSortValue,
}

export const dummyMovie: Omit<IMovie, 'opsDatas'> = {
  id: 45419890,
  senscritique: {
    actors: [],
    category: 'Film',
    countries: [],
    dateRelease: '2024-03-21',
    dateReleaseOriginal: '2024-03-21',
    directors: [],
    duration: 6840,
    frenchReleaseDate: '2024-03-21',
    genresInfos: [],
    id: 45419890,
    originalTitle: 'Dummy Movie',
    pictures: { backdrops: [], posters: [], screenshots: [] },
    polls: [],
    popularity: 24.453393901198204,
    rating: 5.1,
    slug: 'dummy',
    stats: { ratingCount: 0, wishCount: 0, recommendCount: 0, reviewCount: 0 },
    synopsis: '',
    title: 'Dummy Movie',
    yearOfProduction: 2022,
  },
  tmdb: {
    cleanTitle: 'dummymovie',
    digitalRelease: '2024-03-20T00:00:00Z',
    genres: [],
    images: [],
    imdbId: 'imdbid',
    inCinemas: '',
    originalLanguage: { id: 1, name: 'English' },
    originalTitle: 'Dummy Movie',
    popularity: 2147.281,
    ratings: {},
    runtime: 0,
    searchQuery: 0,
    sortTitle: 'dummy movie',
    studio: 'dummy',
    title: 'Dummy Movie',
    tmdbId: 359410,
    year: 2024,
  },
  providers: [],
  search: '',
  updatedAt: new Date('2024-04-05T16:33:28.186Z'),
  released: true,
  popularity: 12,
}

// export const apiUrl: string = 'http://localhost:3002/api'
export const radarrUrl: string = 'https://radarr.fethca-dev.site/api/v3'
export const apiUrl: string = 'https://oklezzgo.jeremy-grijol.com/api'
