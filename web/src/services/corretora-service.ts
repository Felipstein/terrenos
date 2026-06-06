import type { Corretora } from '../types/corretora'
import { request } from '../lib/api/http'

// Lista as corretoras usadas (GET /corretoras), pra autocomplete e filtro.
// A UI conhece só esta interface — não sabe que por baixo é HTTP.
export interface CorretoraService {
  list(): Promise<Corretora[]>
}

export function createHttpCorretoraService(): CorretoraService {
  return {
    list() {
      return request<Corretora[]>('/corretoras')
    },
  }
}

let instance: CorretoraService | null = null

export function getCorretoraService(): CorretoraService {
  if (instance === null) instance = createHttpCorretoraService()
  return instance
}
