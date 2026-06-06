import { z } from 'zod'
import { isValidWhatsapp } from './whatsapp'

// Schema único de validação do terreno (fonte da verdade do form).
// Usado com @hookform/resolvers (zodResolver). Ver skill `forms`.

function requiredPositive(message: string) {
  return z.coerce.number().refine((n) => Number.isFinite(n) && n > 0, message)
}

const optionalPositive = z.preprocess(
  (v) =>
    v === '' || v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))
      ? undefined
      : v,
  z.coerce
    .number()
    .refine((n) => Number.isFinite(n) && n > 0, 'Valor inválido')
    .optional(),
)

const terrenoImagemSchema = z.object({
  id: z.string(),
  url: z.string(),
})

export type TerrenoImagem = z.infer<typeof terrenoImagemSchema>

export const terrenoSchema = z.object({
  rua: z.string().trim().min(1, 'Informe a rua'),
  preco: optionalPositive,
  lat: z.coerce.number().refine(Number.isFinite, 'Selecione o local no mapa'),
  lng: z.coerce.number().refine(Number.isFinite, 'Selecione o local no mapa'),
  areaTotal: requiredPositive('Área deve ser maior que zero'),
  largura: optionalPositive,
  comprimento: optionalPositive,
  link: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z
      .string()
      .refine((s) => /^https?:\/\/.+/.test(s), 'Link inválido')
      .optional(),
  ),
  whatsapp: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().refine(isValidWhatsapp, 'WhatsApp inválido').optional(),
  ),
  corretora: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().optional(),
  ),
  imagens: z.array(terrenoImagemSchema).optional(),
  principalId: z.string().optional(),
})

export type TerrenoInput = z.infer<typeof terrenoSchema>
