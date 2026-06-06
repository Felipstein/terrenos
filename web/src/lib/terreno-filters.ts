import type { Terreno } from '../types/terreno'

export type SortOrder = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'

export type TerrenoFilters = {
  query: string
  sort: SortOrder
}

// Ordena por preço mandando os sem-preço (a negociar) pro fim, tanto em asc
// quanto em desc — eles não competem na faixa de valores.
function byPrice(direction: 1 | -1) {
  return (a: Terreno, b: Terreno): number => {
    if (a.preco === undefined) return b.preco === undefined ? 0 : 1
    if (b.preco === undefined) return -1
    return direction * (a.preco - b.preco)
  }
}

const comparators: Record<SortOrder, (a: Terreno, b: Terreno) => number> = {
  'price-asc': byPrice(1),
  'price-desc': byPrice(-1),
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
