import type { MapsResolver, ResolvedLocation } from '../../application/ports/maps-resolver'
import { ValidationError } from '../../domain/errors'

/**
 * Padrões de coordenadas em URLs do Google Maps, em ordem de preferência:
 * `@lat,lng` (centro do mapa), `!3d…!4d…` (place), `/search|dir|place/lat,lng`
 * (link curto resolve nisso), e `q=`/`query=`/`ll=lat,lng`.
 */
const COORDINATE_PATTERNS: RegExp[] = [
  /@(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  /\/(?:search|dir|place)\/(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  /[?&](?:q|query|destination|center|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
]

// Google às vezes derruba a conexão vinda do IP do datacenter (anti-bot), dando
// ETIMEDOUT intermitente. UA de browser ajuda e o timeout falha rápido. O RETRY
// fica no front (evita compor latência: backend 1x, front até 3x).
const REQUEST_TIMEOUT_MS = 4000
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
}

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

/** Segue o redirect (1 tentativa, com timeout). Devolve a URL final. */
async function resolveFinalUrl(url: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: BROWSER_HEADERS,
    })
    return response.url
  } finally {
    clearTimeout(timer)
  }
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

    const finalUrl = await resolveFinalUrl(url)
    const resolved = extractCoordinates(finalUrl)
    if (!resolved) {
      console.warn('[resolveMapsLink] sem coordenadas na URL final:', finalUrl)
      throw new ValidationError('Não foi possível extrair coordenadas do link')
    }
    return resolved
  }
}
