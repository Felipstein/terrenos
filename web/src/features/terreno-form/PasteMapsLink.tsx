import { useState } from 'react'
import { parseLatLngFromGoogleMapsUrl } from '../../lib/parse-maps-url'
import { getMapsService } from '../../services/maps-service'
import { Button } from '../../components/Button/Button'

type PasteMapsLinkProps = {
  onResolved: (lat: number, lng: number) => void
}

const SHORT_LINK = /maps\.app\.goo\.gl|goo\.gl\/maps/

export function PasteMapsLink({ onResolved }: PasteMapsLinkProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resolving, setResolving] = useState(false)

  async function apply() {
    // Link completo: resolve no próprio navegador (sem backend).
    const point = parseLatLngFromGoogleMapsUrl(value)
    if (point) {
      setError(null)
      onResolved(point.lat, point.lng)
      return
    }

    // Link curto: o backend segue o redirect e extrai as coordenadas.
    if (SHORT_LINK.test(value)) {
      setResolving(true)
      setError(null)
      try {
        const location = await getMapsService().resolveLink(value)
        onResolved(location.lat, location.lng)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não consegui resolver esse link.')
      } finally {
        setResolving(false)
      }
      return
    }

    setError('Não achei coordenadas nesse link. Cole o link do Google Maps.')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-taupe">
        Colar link do Google Maps
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://www.google.com/maps/@..."
          className="h-11 min-w-0 flex-1 rounded-sm border-b-2 border-line bg-paper px-3 text-base text-ink outline-none transition-colors placeholder:text-taupe/50 focus:border-moss"
        />
        <Button type="button" onClick={apply} disabled={resolving} className="shrink-0">
          {resolving ? 'Resolvendo…' : 'Usar'}
        </Button>
      </div>
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </div>
  )
}
