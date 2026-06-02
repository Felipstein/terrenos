import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'
import { formatPriceShort } from '../../lib/format'
import { cn } from '../../lib/cn'

type PriceMarkerProps = {
  terreno: Terreno
  selected: boolean
  onSelect: (id: string) => void
}

export function PriceMarker({ terreno, selected, onSelect }: PriceMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat: terreno.lat, lng: terreno.lng }}
      zIndex={selected ? 1000 : undefined}
      onClick={() => onSelect(terreno.id)}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'whitespace-nowrap rounded-sm border px-2.5 py-1 font-mono text-xs font-semibold text-paper shadow-md transition-colors',
            selected ? 'border-clay-600 bg-clay' : 'border-moss-700 bg-moss',
          )}
        >
          {formatPriceShort(terreno.preco)}
        </div>
        <div
          className={cn(
            '-mt-[3px] h-2 w-2 rotate-45 border-b border-r',
            selected ? 'border-clay-600 bg-clay' : 'border-moss-700 bg-moss',
          )}
        />
      </div>
    </AdvancedMarker>
  )
}
