import * as z from 'zod/mini'
import type { TerrenoInput } from '../domain/terreno/terreno'

const terrenoImageSchema = z.object({
  id: z.string().check(z.minLength(1)),
  url: z.string().check(z.minLength(1)),
})

/**
 * Validação do `TerrenoInput` do contrato + `corretoraTelefone` (telefone da
 * corretora; NÃO é campo do terreno — o use case extrai e faz upsert na
 * corretora). `satisfies` via _typeCheck garante que os campos do terreno batem
 * com o domínio — se o contrato/domínio mudar, o build acusa.
 */
export const terrenoInputSchema = z.object({
  rua: z.string().check(z.minLength(1, 'Informe a rua')),
  isCorner: z.boolean(),
  preco: z.optional(z.number().check(z.positive('Preço inválido'))),
  lat: z.number(),
  lng: z.number(),
  areaTotal: z.number().check(z.positive('Área inválida')),
  largura: z.optional(z.number().check(z.positive())),
  comprimento: z.optional(z.number().check(z.positive())),
  link: z.optional(z.url('Link inválido')),
  whatsapp: z.optional(z.string().check(z.minLength(1))),
  corretora: z.optional(z.string().check(z.minLength(1))),
  corretoraTelefone: z.optional(z.string()),
  imagens: z.optional(z.array(terrenoImageSchema)),
  principalId: z.optional(z.string()),
})

// Confere em tempo de compilação que o schema produz um TerrenoInput + o
// telefone da corretora (campo só de transporte, não persistido no terreno).
const _typeCheck: TerrenoInput & { corretoraTelefone?: string } = {} as z.infer<
  typeof terrenoInputSchema
>
void _typeCheck
