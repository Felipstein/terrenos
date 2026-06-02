import type { Terreno } from '../types/terreno'
import { seedTerrenos } from './seed'

// Contrato da camada de dados. A UI conhece só isto — não sabe se vem de um mock
// em memória ou, no futuro, de um backend HTTP (skill frontend-conventions).
export interface TerrenoService {
  list(): Promise<Terreno[]>
  save(terreno: Terreno): Promise<void>
  remove(id: string): Promise<void>
}

// Mock em memória: começa do seed e **reseta a cada reload** (sem persistência).
// Quando o backend existir, troca-se por uma implementação HTTP sem mexer na UI.
export function createMemoryTerrenoService(initial: Terreno[] = seedTerrenos): TerrenoService {
  let terrenos: Terreno[] = initial.map((terreno) => ({ ...terreno }))

  return {
    async list() {
      return terrenos.map((terreno) => ({ ...terreno }))
    },
    async save(terreno) {
      const index = terrenos.findIndex((item) => item.id === terreno.id)
      if (index >= 0) terrenos[index] = terreno
      else terrenos = [...terrenos, terreno]
    },
    async remove(id) {
      terrenos = terrenos.filter((terreno) => terreno.id !== id)
    },
  }
}

let instance: TerrenoService | null = null

export function getTerrenoService(): TerrenoService {
  if (instance === null) instance = createMemoryTerrenoService()
  return instance
}
