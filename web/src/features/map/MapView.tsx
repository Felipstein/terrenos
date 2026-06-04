import { Map } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'
import { PriceMarker } from './PriceMarker'
import { MapController } from './MapController'
import { InitialView } from './InitialView'
import { MapUnavailable } from './MapUnavailable'
import { DEFAULT_CENTER, MAP_ID, hasGoogleMaps } from './config'

type MapViewProps = {
  terrenos: Terreno[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
  focus: { lat: number; lng: number } | null
}

export function MapView({ terrenos, loading, selectedId, onSelect, focus }: MapViewProps) {
  if (!hasGoogleMaps) {
    return <MapUnavailable />
  }
  return (
    <Map
      mapId={MAP_ID}
      defaultCenter={DEFAULT_CENTER}
      defaultZoom={14}
      gestureHandling="greedy"
      disableDefaultUI
      className="h-full w-full"
    >
      <MapController focus={focus} />
      <InitialView terrenos={terrenos} loading={loading} />
      {terrenos.map((terreno) => (
        <PriceMarker
          key={terreno.id}
          terreno={terreno}
          selected={terreno.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </Map>
  )
}
