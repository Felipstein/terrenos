import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'
import { formatPriceShort } from '../../lib/format'
import { imagemPrincipal } from '../../lib/imagem'
import { cn } from '../../lib/cn'

type PriceMarkerProps = {
  terreno: Terreno
  selected: boolean
  onSelect: (id: string) => void
}

export function PriceMarker({ terreno, selected, onSelect }: PriceMarkerProps) {
  const foto = imagemPrincipal(terreno)
  return (
    <AdvancedMarker
      position={{ lat: terreno.lat, lng: terreno.lng }}
      zIndex={selected ? 1000 : undefined}
      onClick={() => onSelect(terreno.id)}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'min-w-[80px] overflow-hidden rounded-sm border shadow-md',
            selected ? 'border-clay' : 'border-moss-700',
          )}
        >
          {foto ? <img src={foto.url} alt="" className="h-12 w-full object-cover" /> : null}
          <div
            className={cn(
              'whitespace-nowrap px-2 py-0.5 text-center font-mono text-[11px] font-semibold text-paper',
              selected ? 'bg-clay' : 'bg-moss',
            )}
          >
            {formatPriceShort(terreno.preco)}
          </div>
        </div>
        <div
          className={cn(
            '-mt-[3px] h-2 w-2 rotate-45 border-b border-r',
            selected ? 'border-clay bg-clay' : 'border-moss-700 bg-moss',
          )}
        />
      </div>
    </AdvancedMarker>
  )
}
