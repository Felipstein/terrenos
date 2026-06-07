import { z } from 'zod'

// Schema do form de edição de corretora (fonte da validação). Ver skill `forms`.
// `phone` opcional (string vazia = limpar). `name` obrigatório (não renomeia
// pra vazio); o slug é estável no backend, não muda ao renomear.
export const corretoraEditSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome'),
  phone: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? '' : v),
    z.string().optional(),
  ),
})

export type CorretoraEditValues = z.infer<typeof corretoraEditSchema>
