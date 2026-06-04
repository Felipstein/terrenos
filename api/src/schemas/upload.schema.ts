import * as z from 'zod/mini'

export const uploadSchema = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})
