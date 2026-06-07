import * as z from 'zod/mini'

/**
 * Validação do `CorretoraUpdateInput` do contrato. Atualização parcial: ambos
 * opcionais. `phone` aceita string vazia (limpa o telefone); o use case
 * normaliza. `name` exige conteúdo quando presente (não renomeia pra vazio).
 */
export const corretoraUpdateSchema = z.object({
  name: z.optional(z.string().check(z.minLength(1, 'Informe o nome'))),
  phone: z.optional(z.string()),
})
