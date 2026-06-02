import { useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps'

type RecenterMapProps = {
  lat: number
  lng: number
}

// Recentra o mini-mapa quando o ponto muda (ex: colar link). Como o <Map> usa
// defaultCenter (não controlado), o usuário pode panoramar livre sem o mapa
// "puxar de volta" — só recentra quando lat/lng realmente mudam.
export function RecenterMap({ lat, lng }: RecenterMapProps) {
  const map = useMap()
  useEffect(() => {
    if (map) map.panTo({ lat, lng })
  }, [map, lat, lng])
  return null
}
