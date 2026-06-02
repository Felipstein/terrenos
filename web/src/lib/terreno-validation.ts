import { z } from 'zod'

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

export const terrenoSchema = z.object({
  rua: z.string().trim().min(1, 'Informe a rua'),
  preco: requiredPositive('Preço deve ser maior que zero'),
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
})

export type TerrenoInput = z.infer<typeof terrenoSchema>
