/**
 * Normaliza um nome em slug: minúsculas, sem acentos, só `[a-z0-9-]`.
 * É a chave de dedup da Corretora no single-table (SK = CORRETORA#<slug>).
 */
export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos (acentos decompostos)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
