import type { MapsResolver, ResolvedLocation } from '../../application/ports/maps-resolver'
import { ValidationError } from '../../domain/errors'

/**
 * Padrões de coordenadas em URLs do Google Maps, em ordem de preferência:
 * `@lat,lng` (centro do mapa), `!3dlat!4dlng` (place), `/search|dir|place/lat,lng`
 * (link curto resolve nisso), e `q=`/`query=`/`ll=lat,lng`.
 */
const COORDINATE_PATTERNS: RegExp[] = [
  /@(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  /\/(?:search|dir|place)\/(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  /[?&](?:q|query|destination|center|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
]

// Decodifica (links curtos resolvem com `%2C`/`+` no lugar de `, `) e troca `+`
// por espaço pra um único conjunto de padrões cobrir as variações.
function normalize(url: string): string {
  let decoded = url
  try {
    decoded = decodeURIComponent(url)
  } catch {
    // sequência malformada: segue com a URL original
  }
  return decoded.replace(/\+/g, ' ')
}

function extractCoordinates(url: string): { lat: number; lng: number } | null {
  const normalized = normalize(url)
  for (const pattern of COORDINATE_PATTERNS) {
    const match = normalized.match(pattern)
    if (match) {
      return { lat: Number(match[1]), lng: Number(match[2]) }
    }
  }
  return null
}

/**
 * Resolve links do Google Maps. Links completos têm as coordenadas na própria
 * URL; links curtos (`maps.app.goo.gl`) são um redirect que seguimos
 * server-side (o `fetch` do Node segue redirect e expõe a URL final).
 */
export class HttpMapsResolver implements MapsResolver {
  async resolve(url: string): Promise<ResolvedLocation> {
    const direct = extractCoordinates(url)
    if (direct) {
      return direct
    }

    const response = await fetch(url, { redirect: 'follow' })
    const resolved = extractCoordinates(response.url)
    if (!resolved) {
      console.warn('[resolveMapsLink] sem coordenadas na URL final:', response.url)
      throw new ValidationError('Não foi possível extrair coordenadas do link')
    }
    return resolved
  }
}
