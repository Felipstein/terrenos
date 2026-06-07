import type { Terreno } from '../../types/terreno'
import { InfoField } from '../../components/InfoField/InfoField'

type TerrenoInfoProps = {
  terreno: Terreno
}

export function TerrenoInfo({ terreno }: TerrenoInfoProps) {
  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="grid grid-cols-3 gap-3 border-y border-line py-4">
        <InfoField label="Área" value={`${terreno.areaTotal} m²`} />
        {terreno.largura ? <InfoField label="Largura" value={`${terreno.largura} m`} /> : null}
        {terreno.comprimento ? (
          <InfoField label="Comprimento" value={`${terreno.comprimento} m`} />
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
