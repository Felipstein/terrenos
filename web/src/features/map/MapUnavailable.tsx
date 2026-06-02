import { cn } from '../../lib/cn'

type MapUnavailableProps = {
  className?: string
}

export function MapUnavailable({ className }: MapUnavailableProps) {
  return (
    <div className={cn('topo-grid grid h-full w-full place-items-center bg-paper p-6 text-center', className)}>
      <div className="max-w-xs text-sm text-taupe">
        <p className="font-serif text-base font-semibold text-ink">Mapa indisponível</p>
        <p className="mt-1">
          Configure <code className="rounded-sm bg-ink/5 px-1 font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> em{' '}
          <code className="rounded-sm bg-ink/5 px-1 font-mono text-xs">web/.env.local</code>.
        </p>
      </div>
    </div>
  )
}
