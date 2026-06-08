import type { Terreno } from '../../types/terreno'
import { InfoField } from '../../components/InfoField/InfoField'
import { formatArea, formatMeasure } from '../../lib/format'

type TerrenoInfoProps = {
  terreno: Terreno
}

export function TerrenoInfo({ terreno }: TerrenoInfoProps) {
  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="grid grid-cols-3 gap-3 border-y border-line py-4">
        {terreno.areaTotal ? (
          <InfoField label="Área" value={formatArea(terreno.areaTotal)} />
        ) : null}
        {terreno.largura ? (
          <InfoField label="Largura" value={formatMeasure(terreno.largura)} />
        ) : null}
        {terreno.comprimento ? (
          <InfoField label="Comprimento" value={formatMeasure(terreno.comprimento)} />
        ) : null}
        <InfoField label="Esquina" value={terreno.isCorner ? 'Sim' : 'Não'} />
      </div>

      <p className="font-mono text-[11px] tracking-wide text-taupe">
        {terreno.lat.toFixed(5)}, {terreno.lng.toFixed(5)}
      </p>

      {terreno.link ? (
        <a
          href={terreno.link}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-clay underline-offset-2 hover:underline"
        >
          Ver anúncio completo →
        </a>
      ) : null}
    </div>
  )
}
