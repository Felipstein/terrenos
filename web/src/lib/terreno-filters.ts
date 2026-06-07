import type { Terreno } from '../types/terreno'
import { pricePerSquareMeter } from './format'

export type SortOrder =
  | 'price-asc'
  | 'price-desc'
  | 'area-asc'
  | 'area-desc'
  | 'pricePerSqm-asc'
  | 'pricePerSqm-desc'

// Filtro de esquina: todos / só esquinas / não esquinas.
export type CornerFilter = 'all' | 'corner' | 'non-corner'

export type TerrenoFilters = {
  query: string
  sort: SortOrder
  corretora: string // nome da corretora; '' = todas
  corner: CornerFilter
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

// Ordena por preço/m², mandando quem não tem valor (sem preço ou sem área) pro
// fim em asc e desc — mesma regra do preço, pra não competir na faixa de valores.
function byPricePerSqm(direction: 1 | -1) {
  return (a: Terreno, b: Terreno): number => {
    const pa = pricePerSquareMeter(a.preco, a.areaTotal)
    const pb = pricePerSquareMeter(b.preco, b.areaTotal)
    if (pa === undefined) return pb === undefined ? 0 : 1
    if (pb === undefined) return -1
    return direction * (pa - pb)
  }
}

const comparators: Record<SortOrder, (a: Terreno, b: Terreno) => number> = {
  'price-asc': byPrice(1),
  'price-desc': byPrice(-1),
  'area-asc': (a, b) => a.areaTotal - b.areaTotal,
  'area-desc': (a, b) => b.areaTotal - a.areaTotal,
  'pricePerSqm-asc': byPricePerSqm(1),
  'pricePerSqm-desc': byPricePerSqm(-1),
}

function matchesCorner(terreno: Terreno, corner: CornerFilter): boolean {
  if (corner === 'corner') return terreno.isCorner === true
  if (corner === 'non-corner') return terreno.isCorner !== true
  return true
}

// Só filtra (ordem original preservada) — usado no mapa, pra não reordenar os
// pins (e não "piscar") quando muda só a ordenação da tabela. Filtra por endereço,
// por corretora (nome exato; '' = todas) e por esquina (all/corner/non-corner).
export function filterTerrenos(
  terrenos: Terreno[],
  query: string,
  corretora: string,
  corner: CornerFilter = 'all',
): Terreno[] {
  const q = query.trim().toLowerCase()
  if (!q && !corretora && corner === 'all') return terrenos
  return terrenos.filter((terreno) => {
    if (q && !terreno.rua.toLowerCase().includes(q)) return false
    if (corretora && terreno.corretora !== corretora) return false
    if (!matchesCorner(terreno, corner)) return false
    return true
  })
}

export function sortTerrenos(terrenos: Terreno[], sort: SortOrder): Terreno[] {
  return [...terrenos].sort(comparators[sort])
}

export function filterAndSort(terrenos: Terreno[], filters: TerrenoFilters): Terreno[] {
  return sortTerrenos(
    filterTerrenos(terrenos, filters.query, filters.corretora, filters.corner),
    filters.sort,
  )
}
