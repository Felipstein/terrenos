import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { PointerEvent } from 'react'
import type { Terreno } from '../../types/terreno'
import { formatArea, displayPriceShort } from '../../lib/format'
import { imagemPrincipal } from '../../lib/imagem'
import { cn } from '../../lib/cn'

type PriceMarkerProps = {
  terreno: Terreno
  selected: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

// z-index dos pinos: hover acima de tudo, selecionado logo abaixo, demais no fluxo normal.
const HOVERED_Z = 2000
const SELECTED_Z = 1000

// Só ponteiro fino (mouse) dispara hover; toque segue o fluxo normal de seleção.
function isMousePointer(event: PointerEvent): boolean {
  return event.pointerType === 'mouse'
}

export function PriceMarker({ terreno, selected, hovered, onSelect, onHover }: PriceMarkerProps) {
  const photo = imagemPrincipal(terreno)
  const sizeLabel =
    terreno.largura && terreno.comprimento
      ? `${formatArea(terreno.areaTotal)} · ${terreno.largura}×${terreno.comprimento}`
      : formatArea(terreno.areaTotal)
  // Destaque (moss) quando selecionado OU em hover — efeito idêntico venha da lista ou do pino.
  const highlighted = selected || hovered
  // Com preço: clay. Sem preço (a negociar): taupe.
  const tone = highlighted
    ? { border: 'border-moss-700', bg: 'bg-moss' }
    : terreno.preco !== undefined
      ? { border: 'border-clay-600', bg: 'bg-clay' }
      : { border: 'border-taupe-700', bg: 'bg-taupe' }
  const zIndex = hovered ? HOVERED_Z : selected ? SELECTED_Z : undefined

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (isMousePointer(event)) onHover(terreno.id)
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (isMousePointer(event)) onHover(null)
  }

  return (
    <AdvancedMarker
      position={{ lat: terreno.lat, lng: terreno.lng }}
      zIndex={zIndex}
      onClick={() => onSelect(terreno.id)}
    >
      <div
        className="flex flex-col items-center"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className={cn(
            'min-w-[80px] overflow-hidden rounded-sm border shadow-md transition-transform',
            tone.border,
            highlighted && 'scale-110',
          )}
        >
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
