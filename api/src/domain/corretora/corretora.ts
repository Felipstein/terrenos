import { slugify } from './slug'

/** Imobiliária/corretora. Reutilizável entre terrenos, deduplicada por `slug`. */
export type Corretora = {
  slug: string
  name: string
}

/**
 * Cria uma Corretora a partir do nome digitado: guarda o nome trimado (preserva
 * a capitalização) e deriva o slug pra dedup. Retorna `undefined` quando o nome
 * é vazio ou vira slug vazio (ex: só símbolos) — aí o terreno fica sem corretora.
 */
export function makeCorretora(name: string | undefined): Corretora | undefined {
  if (name === undefined) return undefined
  const trimmed = name.trim()
  const slug = slugify(trimmed)
  if (slug === '') return undefined
  return { slug, name: trimmed }
}
