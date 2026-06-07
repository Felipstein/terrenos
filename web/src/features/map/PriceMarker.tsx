import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Terreno } from '../../types/terreno'
import { displayArea, displayPriceShort } from '../../lib/format'
import { imagemPrincipal } from '../../lib/imagem'
import { cn } from '../../lib/cn'

type PriceMarkerProps = {
  terreno: Terreno
  selected: boolean
  onSelect: (id: string) => void
}

export function PriceMarker({ terreno, selected, onSelect }: PriceMarkerProps) {
  const photo = imagemPrincipal(terreno)
  const sizeLabel =
    terreno.largura && terreno.comprimento
      ? `${displayArea(terreno.areaTotal)} · ${terreno.largura}×${terreno.comprimento}`
      : displayArea(terreno.areaTotal)
  // Selecionado: moss. Com preço: clay. Sem preço (a negociar): taupe.
  const tone = selected
    ? { border: 'border-moss-700', bg: 'bg-moss' }
    : terreno.preco !== undefined
      ? { border: 'border-clay-600', bg: 'bg-clay' }
      : { border: 'border-taupe-700', bg: 'bg-taupe' }
  return (
    <AdvancedMarker
      position={{ lat: terreno.lat, lng: terreno.lng }}
      zIndex={selected ? 1000 : undefined}
      onClick={() => onSelect(terreno.id)}
    >
      <div className="flex flex-col items-center">
        <div className={cn('min-w-[80px] overflow-hidden rounded-sm border shadow-md', tone.border)}>
          {photo ? <img src={photo.url} alt="" className="h-12 w-full object-cover" /> : null}
          <div className={cn('px-2.5 py-1 text-center font-mono text-paper', tone.bg)}>
            <div className="whitespace-nowrap text-[13px] font-bold leading-tight">
              {displayPriceShort(terreno.preco)}
            </div>
            <div className="mt-0.5 whitespace-nowrap text-[11px] font-medium leading-tight text-paper/90">
              {sizeLabel}
            </div>
            {terreno.corretora ? (
              <div className="mx-auto mt-0.5 max-w-[120px] truncate text-[9px] font-medium uppercase leading-tight tracking-wide text-paper/75">
                {terreno.corretora}
              </div>
            ) : null}
          </div>
        </div>
        <div className={cn('-mt-[3px] h-2 w-2 rotate-45 border-b border-r', tone.border, tone.bg)} />
      </div>
    </AdvancedMarker>
  )
}
