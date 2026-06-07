import { useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'

type HoverPanControllerProps = {
  hovered: Terreno | null
}

// Quando um pino entra em hover (vindo da lista), garante que ele esteja visível:
// se cair fora dos bounds atuais do mapa, faz um panTo suave até ele.
// Não mexe no zoom e não reage a hover de pinos já visíveis (evita pan desnecessário).
export function HoverPanController({ hovered }: HoverPanControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!map || !hovered) return
    const bounds = map.getBounds()
    const position = { lat: hovered.lat, lng: hovered.lng }
    if (bounds && bounds.contains(position)) return
    map.panTo(position)
  }, [map, hovered])

  return null
}
