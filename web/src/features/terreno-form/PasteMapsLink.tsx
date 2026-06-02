import { useState } from 'react'
import { parseLatLngFromGoogleMapsUrl } from '../../lib/parse-maps-url'
import { Button } from '../../components/Button/Button'

type PasteMapsLinkProps = {
  onResolved: (lat: number, lng: number) => void
}

export function PasteMapsLink({ onResolved }: PasteMapsLinkProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function apply() {
    const point = parseLatLngFromGoogleMapsUrl(value)
    if (!point) {
      const isShortLink = /maps\.app\.goo\.gl|goo\.gl\/maps/.test(value)
      setError(
        isShortLink
          ? 'Link curto ainda não funciona. Abra ele no navegador e cole o link completo (com @-22...,-47...).'
          : 'Não achei coordenadas nesse link. Cole o link completo do Google Maps.',
      )
      return
    }
    setError(null)
    onResolved(point.lat, point.lng)
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
        <Button type="button" onClick={apply} className="shrink-0">
          Usar
        </Button>
      </div>
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </div>
  )
}
