import { useState } from 'react'
import { Map } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'
import { PriceMarker } from './PriceMarker'
import { MapController } from './MapController'
import { MapTypeControl, type MapTypeId } from './MapTypeControl'
import { HoverPanController } from './HoverPanController'
import { InitialView } from './InitialView'
import { MapUnavailable } from './MapUnavailable'
import { AddTargetCrosshair } from './AddTargetCrosshair'
import { AddModeControls } from './AddModeControls'
import { DEFAULT_CENTER, MAP_ID, hasGoogleMaps } from './config'

type MapViewProps = {
  terrenos: Terreno[]
  loading: boolean
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  focus: { lat: number; lng: number } | null
  addMode: boolean
  onConfirmCreate: (lat: number, lng: number) => void
  onCancelAdd: () => void
}

export function MapView({
  terrenos,
  loading,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  focus,
  addMode,
  onConfirmCreate,
  onCancelAdd,
}: MapViewProps) {
  const [mapTypeId, setMapTypeId] = useState<MapTypeId>('roadmap')
  if (!hasGoogleMaps) {
    return <MapUnavailable />
  }
  const hovered = hoveredId ? (terrenos.find((terreno) => terreno.id === hoveredId) ?? null) : null
  return (
    <div className="relative h-full w-full">
      <Map
        mapId={MAP_ID}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={14}
        mapTypeId={mapTypeId}
        gestureHandling="greedy"
        disableDefaultUI
        className="h-full w-full"
      >
        <MapController focus={focus} />
        <HoverPanController hovered={hovered} />
        <InitialView terrenos={terrenos} loading={loading} />
        {terrenos.map((terreno) => (
          <PriceMarker
            key={terreno.id}
            terreno={terreno}
            selected={terreno.id === selectedId}
            hovered={terreno.id === hoveredId}
            onSelect={addMode ? () => {} : onSelect}
            onHover={onHover}
          />
        ))}
        {addMode ? <AddModeControls onConfirm={onConfirmCreate} onCancel={onCancelAdd} /> : null}
      </Map>

      {addMode ? <AddTargetCrosshair /> : null}

      <div className="absolute left-4 top-4 z-[1000]">
        <MapTypeControl value={mapTypeId} onChange={setMapTypeId} />
      </div>
    </div>
  )
}
