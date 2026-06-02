import { buildDirectionsUrl } from '../../lib/maps'

type RouteButtonProps = {
  lat: number
  lng: number
}

export function RouteButton({ lat, lng }: RouteButtonProps) {
  return (
    <a
      href={buildDirectionsUrl(lat, lng)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-clay text-sm font-semibold text-paper transition-colors hover:bg-clay-600"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 20-6-3V4l6 3m0 13 6-3m-6 3V7m6 10 6 3V7l-6-3m0 13V4m0 0L9 7" />
      </svg>
      Abrir rota no Google Maps
    </a>
  )
}
