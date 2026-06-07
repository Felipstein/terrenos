import { slugify } from './slug'

/** Imobiliária/corretora. Reutilizável entre terrenos, deduplicada por `slug`. */
export type Corretora = {
  slug: string
  name: string
  phone?: string
}

/** Normaliza um telefone digitado: trima; vira `undefined` quando vazio. */
export function normalizePhone(phone: string | undefined): string | undefined {
  if (phone === undefined) return undefined
  const trimmed = phone.trim()
  return trimmed === '' ? undefined : trimmed
}

/**
 * Cria uma Corretora a partir do nome digitado: guarda o nome trimado (preserva
 * a capitalização) e deriva o slug pra dedup. Telefone é opcional. Retorna
 * `undefined` quando o nome é vazio ou vira slug vazio (ex: só símbolos) — aí o
 * terreno fica sem corretora.
 */
export function makeCorretora(
  name: string | undefined,
  phone?: string | undefined,
): Corretora | undefined {
  if (name === undefined) return undefined
  const trimmed = name.trim()
  const slug = slugify(trimmed)
  if (slug === '') return undefined
  const normalizedPhone = normalizePhone(phone)
  return normalizedPhone === undefined
    ? { slug, name: trimmed }
    : { slug, name: trimmed, phone: normalizedPhone }
}
