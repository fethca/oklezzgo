import { z } from 'zod'

export const optionSchema = z.object({ id: z.number(), name: z.string() })
export type IFilterOption = z.infer<typeof optionSchema>

export const isFilterOption = (value: unknown): value is IFilterOption => {
  const { success } = optionSchema.safeParse(value)
  return success
}

export const isFilterOptions = (value: unknown): value is IFilterOption[] => {
  const { success } = z.array(optionSchema).safeParse(value)
  return success
}

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
    directors: z.array(optionSchema.transform((director) => director.id)),
    actors: z.array(optionSchema.transform((actor) => actor.id)),
    polls: z.array(optionSchema.transform((poll) => poll.id)),
  }),
)

export type IFormattedFilters = z.infer<typeof filterFormatter>
