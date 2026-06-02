import type { Terreno } from '../types/terreno'

export type SortOrder = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'

export type TerrenoFilters = {
  query: string
  sort: SortOrder
}

const comparators: Record<SortOrder, (a: Terreno, b: Terreno) => number> = {
  'price-asc': (a, b) => a.preco - b.preco,
  'price-desc': (a, b) => b.preco - a.preco,
  'area-asc': (a, b) => a.areaTotal - b.areaTotal,
  'area-desc': (a, b) => b.areaTotal - a.areaTotal,
}

// Só filtra (ordem original preservada) — usado no mapa, pra não reordenar os
// pins (e não "piscar") quando muda só a ordenação da tabela.
export function filterTerrenos(terrenos: Terreno[], query: string): Terreno[] {
  const q = query.trim().toLowerCase()
  return q ? terrenos.filter((terreno) => terreno.rua.toLowerCase().includes(q)) : terrenos
}

export function sortTerrenos(terrenos: Terreno[], sort: SortOrder): Terreno[] {
  return [...terrenos].sort(comparators[sort])
}

export function filterAndSort(terrenos: Terreno[], filters: TerrenoFilters): Terreno[] {
  return sortTerrenos(filterTerrenos(terrenos, filters.query), filters.sort)
}
