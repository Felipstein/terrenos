/** Coordenadas resolvidas a partir de um link do Google Maps. */
export type ResolvedLocation = {
  lat: number
  lng: number
  address?: string
}

/**
 * Resolve um link do Google Maps (inclusive curto, `maps.app.goo.gl`) em
 * coordenadas. Implementação segue o redirect server-side e extrai lat/lng.
 */
export interface MapsResolver {
  resolve(url: string): Promise<ResolvedLocation>
}
