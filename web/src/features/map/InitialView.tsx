import { useEffect, useRef } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'

type InitialViewProps = {
  terrenos: Terreno[]
  loading: boolean
}

const SINGLE_TERRENO_ZOOM = 15
const GEOLOCATION_ZOOM = 13
const BOUNDS_PADDING_PX = 64

// Centraliza o mapa UMA vez, quando a lista termina de carregar:
//  - vários terrenos → enquadra todos (fitBounds);
//  - um só → centra nele;
//  - nenhum → tenta a localização do navegador (GPS); se negar/falhar, fica
//    no defaultCenter do <Map>.
export function InitialView({ terrenos, loading }: InitialViewProps) {
  const map = useMap()
  const centered = useRef(false)

  useEffect(() => {
    console.debug('[InitialView] effect', { hasMap: !!map, loading, count: terrenos.length })
    if (!map || loading || centered.current) return
    centered.current = true

    if (terrenos.length > 1) {
      const lats = terrenos.map((terreno) => terreno.lat)
      const lngs = terrenos.map((terreno) => terreno.lng)
      map.fitBounds(
        {
          north: Math.max(...lats),
          south: Math.min(...lats),
          east: Math.max(...lngs),
          west: Math.min(...lngs),
        },
        BOUNDS_PADDING_PX,
      )
      return
    }

    if (terrenos.length === 1) {
      const only = terrenos[0]
      if (only) {
        map.panTo({ lat: only.lat, lng: only.lng })
        map.setZoom(SINGLE_TERRENO_ZOOM)
      }
      return
    }

    if (!navigator.geolocation) {
      console.debug('[InitialView] geolocation indisponível')
      return
    }
    console.debug('[InitialView] pedindo geolocation…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.debug('[InitialView] geolocation OK', position.coords.latitude, position.coords.longitude)
        map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude })
        map.setZoom(GEOLOCATION_ZOOM)
      },
      (error) => {
        // negou ou falhou: mantém o defaultCenter
        console.warn('[InitialView] geolocation falhou:', error.code, error.message)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    )
  }, [map, loading, terrenos])

  return null
}
