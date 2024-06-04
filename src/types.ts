import { z } from 'zod'

export const mongoIdSchema = z.object({ _id: z.string() }).passthrough()
export const optionSchema = mongoIdSchema.merge(z.object({ name: z.string() })).passthrough()
export type IFilterOptions = z.infer<typeof optionSchema>

export const filterSchema = z.object({
  categories: z.array(z.string()),
  countries: z.array(z.string()),
  dateRelease: z.array(z.number()),
  directors: z.array(optionSchema),
  actors: z.array(optionSchema),
  polls: z.array(optionSchema),
  duration: z.array(z.number()),
  genres: z.array(z.string()),
  image: z.string(),
  popularity: z.array(z.number()),
  rating: z.array(z.number()),
  released: z.boolean(),
  sortOrder: z.string(),
  sortValue: z.string(),
})

export type IFilters = z.infer<typeof filterSchema>

export const filterFormatter = filterSchema.merge(
  z.object({
    directors: z.array(optionSchema.transform((director) => director._id)),
    actors: z.array(optionSchema.transform((actor) => actor._id)),
    polls: z.array(optionSchema.transform((poll) => poll._id)),
  }),
)

export type IFormattedFilters = z.infer<typeof filterFormatter>
