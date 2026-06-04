import * as z from 'zod/mini'

export const resolveMapsLinkSchema = z.object({
  url: z.url('Link inválido'),
})
