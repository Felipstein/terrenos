import { cn } from '../../lib/cn'

export type MapTypeId = 'roadmap' | 'satellite'

type MapTypeControlProps = {
  value: MapTypeId
  onChange: (value: MapTypeId) => void
}

const OPTIONS: ReadonlyArray<{ id: MapTypeId; label: string }> = [
  { id: 'roadmap', label: 'Mapa' },
  { id: 'satellite', label: 'Satélite' },
]

// Segmented control flutuante pra alternar entre mapa (roadmap) e satélite.
export function MapTypeControl({ value, onChange }: MapTypeControlProps) {
  return (
    <div
      role="group"
      aria-label="Tipo de mapa"
      className="inline-flex items-center gap-0.5 rounded-md bg-surface/90 p-0.5 shadow-sm ring-1 ring-line backdrop-blur"
    >
      {OPTIONS.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors',
              active ? 'bg-clay text-paper shadow-sm' : 'text-taupe hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
