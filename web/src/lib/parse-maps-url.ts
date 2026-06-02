export type LatLng = { lat: number; lng: number }

// Extrai lat/lng de uma URL completa do Google Maps (parse 100% no navegador).
// Link curto (maps.app.goo.gl) precisa resolver redirect => fica pra quando
// houver backend. Ver skill `map-deeplinks`.
const patterns: RegExp[] = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // .../@lat,lng,zoom
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // place data !3dLAT!4dLNG
  /[?&](?:q|query|ll|destination|center)=(-?\d+\.\d+),(-?\d+\.\d+)/, // q=lat,lng
]

export function parseLatLngFromGoogleMapsUrl(url: string): LatLng | null {
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      const lat = Number(match[1])
      const lng = Number(match[2])
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
    }
  }
  return null
}
