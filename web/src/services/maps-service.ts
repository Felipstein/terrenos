import type { components } from '../types/api'
import { request } from '../lib/api/http'

// Resolve link do Google Maps em coordenadas via POST /maps/resolve-link.
// Usado só pra link CURTO (maps.app.goo.gl) — link completo o front resolve
// sozinho com parseLatLngFromGoogleMapsUrl, sem ir ao backend.
type ResolvedLocation = components['schemas']['ResolvedLocation']

export interface MapsService {
  resolveLink(url: string): Promise<ResolvedLocation>
}

export function createHttpMapsService(): MapsService {
  return {
    resolveLink(url) {
      return request<ResolvedLocation>('/maps/resolve-link', { method: 'POST', body: { url } })
    },
  }
}

let instance: MapsService | null = null

export function getMapsService(): MapsService {
  if (instance === null) instance = createHttpMapsService()
  return instance
}
