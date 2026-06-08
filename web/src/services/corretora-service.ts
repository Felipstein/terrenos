import type { Corretora, CorretoraUpdateInput } from '../types/corretora'
import { request } from '../lib/api/http'

// Lista (GET /corretoras) e edita (PUT /corretoras/{slug}) as corretoras da conta.
// A UI conhece só esta interface — não sabe que por baixo é HTTP.
export interface CorretoraService {
  list(): Promise<Corretora[]>
  update(slug: string, input: CorretoraUpdateInput): Promise<Corretora>
}

export function createHttpCorretoraService(): CorretoraService {
  return {
    list() {
      return request<Corretora[]>('/corretoras')
    },
    update(slug, input) {
      return request<Corretora>(`/corretoras/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        body: input,
      })
    },
  }
}

let instance: CorretoraService | null = null

export function getCorretoraService(): CorretoraService {
  if (instance === null) instance = createHttpCorretoraService()
  return instance
}
