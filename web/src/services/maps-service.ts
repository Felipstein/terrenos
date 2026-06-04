import type { components } from '../types/api'
import { request } from '../lib/api/http'
import { ApiError } from '../lib/api/errors'

// Resolve link do Google Maps em coordenadas via POST /maps/resolve-link.
// Usado só pra link CURTO (maps.app.goo.gl) — link completo o front resolve
// sozinho com parseLatLngFromGoogleMapsUrl, sem ir ao backend.
type ResolvedLocation = components['schemas']['ResolvedLocation']

const MAX_ATTEMPTS = 3

// O backend depende do Google (que às vezes derruba a conexão) e o celular tem
// rede instável → tenta de novo em erro TRANSITÓRIO. Link ruim (4xx, ex: 422
// "sem coordenadas") é definitivo: falha na hora, sem retry.
function isRetriable(error: unknown): boolean {
  if (error instanceof ApiError) return error.status >= 500 || error.status === 0
  return true // erro de rede (fetch falhou) → vale tentar de novo
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface MapsService {
  resolveLink(url: string): Promise<ResolvedLocation>
}

export function createHttpMapsService(): MapsService {
  return {
    async resolveLink(url) {
      let lastError: unknown
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          return await request<ResolvedLocation>('/maps/resolve-link', {
            method: 'POST',
            body: { url },
          })
        } catch (error) {
          lastError = error
          if (!isRetriable(error) || attempt === MAX_ATTEMPTS) throw error
          await wait(attempt * 400) // backoff: 400ms, 800ms
        }
      }
      throw lastError
    },
  }
}

let instance: MapsService | null = null

export function getMapsService(): MapsService {
  if (instance === null) instance = createHttpMapsService()
  return instance
}
