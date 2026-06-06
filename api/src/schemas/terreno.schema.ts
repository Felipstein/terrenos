import * as z from 'zod/mini'
import type { TerrenoInput } from '../domain/terreno/terreno'

const terrenoImageSchema = z.object({
  id: z.string().check(z.minLength(1)),
  url: z.string().check(z.minLength(1)),
})

/**
 * Validação do `TerrenoInput` do contrato. `satisfies` garante que o tipo
 * inferido bate com o domínio — se o contrato/domínio mudar, o build acusa.
 */
export const terrenoInputSchema = z.object({
  rua: z.string().check(z.minLength(1, 'Informe a rua')),
  preco: z.optional(z.number().check(z.positive('Preço inválido'))),
  lat: z.number(),
  lng: z.number(),
  areaTotal: z.number().check(z.positive('Área inválida')),
  largura: z.optional(z.number().check(z.positive())),
  comprimento: z.optional(z.number().check(z.positive())),
  link: z.optional(z.url('Link inválido')),
  whatsapp: z.optional(z.string().check(z.minLength(1))),
  imagens: z.optional(z.array(terrenoImageSchema)),
  principalId: z.optional(z.string()),
})

// Confere em tempo de compilação que o schema produz exatamente um TerrenoInput.
const _typeCheck: TerrenoInput = {} as z.infer<typeof terrenoInputSchema>
void _typeCheck
