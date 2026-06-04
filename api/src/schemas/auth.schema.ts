import * as z from 'zod/mini'

export const loginSchema = z.object({
  username: z.string().check(z.minLength(1, 'Informe o usuário')),
  password: z.string().check(z.minLength(1, 'Informe a senha')),
})

export const refreshSchema = z.object({
  refreshToken: z.string().check(z.minLength(1, 'Refresh token ausente')),
})
