import { Map, AdvancedMarker, type MapMouseEvent } from '@vis.gl/react-google-maps'
import { MapUnavailable } from '../map/MapUnavailable'
import { MAP_ID, hasGoogleMaps } from '../map/config'
import { RecenterMap } from './RecenterMap'

type LocationPickerProps = {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  if (!hasGoogleMaps) {
    return <MapUnavailable className="h-52 rounded-sm border border-line" />
  }

  function handleClick(event: MapMouseEvent) {
    const point = event.detail.latLng
    if (point) onChange(point.lat, point.lng)
  }

  return (
    <div className="h-52 w-full overflow-hidden rounded-sm border border-line">
      <Map
        mapId={MAP_ID}
        defaultCenter={{ lat, lng }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI
        className="h-full w-full"
        onClick={handleClick}
      >
        <RecenterMap lat={lat} lng={lng} />
        <AdvancedMarker
          position={{ lat, lng }}
          draggable
          onDragEnd={(event) => {
            const point = event.latLng
            if (point) onChange(point.lat(), point.lng())
          }}
        />
      </Map>
    </div>
  )
}
