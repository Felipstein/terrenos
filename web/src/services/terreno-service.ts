import type { Terreno, TerrenoInput } from '../types/terreno'
import { request } from '../lib/api/http'

// Camada de dados dos terrenos sobre o backend (contract/openapi.yaml).
// A UI conhece só esta interface — não sabe que por baixo é HTTP.
// create e update são separados porque o contrato separa POST e PUT, e o `id`
// é gerado pelo servidor (volta no corpo da resposta).
export interface TerrenoService {
  list(): Promise<Terreno[]>
  create(input: TerrenoInput): Promise<Terreno>
  update(terreno: Terreno): Promise<Terreno>
  remove(id: string): Promise<void>
}

export function createHttpTerrenoService(): TerrenoService {
  return {
    list() {
      return request<Terreno[]>('/terrenos')
    },
    create(input) {
      return request<Terreno>('/terrenos', { method: 'POST', body: input })
    },
    update({ id, ...input }) {
      return request<Terreno>(`/terrenos/${id}`, { method: 'PUT', body: input })
    },
    remove(id) {
      return request<void>(`/terrenos/${id}`, { method: 'DELETE' })
    },
  }
}

let instance: TerrenoService | null = null

export function getTerrenoService(): TerrenoService {
  if (instance === null) instance = createHttpTerrenoService()
  return instance
}
