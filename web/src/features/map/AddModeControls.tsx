import { useMap } from '@vis.gl/react-google-maps'
import { Button } from '../../components/Button/Button'

type AddModeControlsProps = {
  onConfirm: (lat: number, lng: number) => void
  onCancel: () => void
}

// Barra de ação do modo de adição. Fica embaixo (mobile-first) e confirma a
// criação lendo o CENTRO atual do mapa (`map.getCenter()`) — combina com a mira
// fixa no centro (AddTargetCrosshair). Roda dentro do <Map>, por isso pode usar
// useMap. Governado pela skill `map-deeplinks`.
export function AddModeControls({ onConfirm, onCancel }: AddModeControlsProps) {
  const map = useMap()

  function confirm() {
    const center = map?.getCenter()
    if (!center) return
    onConfirm(center.lat(), center.lng())
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1100] flex flex-col items-center gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-10">
      <div className="pointer-events-auto rounded-md bg-surface/95 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-taupe shadow-sm ring-1 ring-line backdrop-blur">
        Arraste o mapa pra mirar o terreno
      </div>
      <div className="pointer-events-auto flex w-full max-w-sm items-center gap-2">
        <Button
          variant="ghost"
          onClick={onCancel}
          aria-label="Cancelar adição"
          className="h-12 w-12 shrink-0 bg-surface/95 px-0 shadow-md ring-1 ring-line backdrop-blur"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Button>
        <Button variant="accent" onClick={confirm} className="h-12 flex-1 shadow-md">
          Criar aqui →
        </Button>
      </div>
    </div>
  )
}
