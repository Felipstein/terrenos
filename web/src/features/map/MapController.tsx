import { useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps'

type MapControllerProps = {
  focus: { lat: number; lng: number } | null
}

// Faz o mapa voar até o ponto selecionado (ex: ao tocar num card da lista).
export function MapController({ focus }: MapControllerProps) {
  const map = useMap()
  useEffect(() => {
    if (map && focus) map.panTo(focus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, focus?.lat, focus?.lng])
  return null
}
