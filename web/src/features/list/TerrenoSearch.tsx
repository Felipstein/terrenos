import { useId } from 'react'
import type { Corretora } from '../../types/corretora'
import type { CornerFilter } from '../../lib/terreno-filters'
import { Combobox } from '../../components/Combobox/Combobox'

type TerrenoSearchProps = {
  query: string
  count: number
  corretoras: Corretora[]
  corretora: string
  corner: CornerFilter
  onQuery: (value: string) => void
  onCorretora: (value: string) => void
  onCorner: (value: CornerFilter) => void
}

const CORNER_OPTIONS: { value: CornerFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'corner', label: 'Esquina' },
  { value: 'non-corner', label: 'Sem esquina' },
]

export function TerrenoSearch({
  query,
  count,
  corretoras,
  corretora,
  corner,
  onQuery,
  onCorretora,
  onCorner,
}: TerrenoSearchProps) {
  // TerrenoSearch é montado 2x (SidePanel desktop + MapSheet mobile); id único
  // por instância evita id duplicado no DOM.
  const filterId = useId()
  return (
    <div className="flex flex-col gap-2.5 px-4 pb-3 pt-4">
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Buscar por endereço"
        className="h-11 w-full rounded-sm border-b-2 border-line bg-paper px-3 text-base text-ink outline-none transition-colors placeholder:text-taupe/50 focus:border-moss"
      />

      {corretoras.length > 0 ? (
        <Combobox
          id={filterId}
          value={corretora}
          options={[
            { value: '', label: 'Todas as corretoras' },
            ...corretoras.map((c) => ({ value: c.name, label: c.name })),
          ]}
          onChange={onCorretora}
          placeholder="Todas as corretoras"
          emptyLabel="Nenhuma corretora"
        />
      ) : null}

      <div className="flex gap-1 rounded-sm border border-line bg-paper p-0.5">
        {CORNER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onCorner(option.value)}
            aria-pressed={corner === option.value}
            className={`flex-1 rounded-sm px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
              corner === option.value
                ? 'bg-clay text-white'
                : 'text-taupe hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-taupe">
        {count} {count === 1 ? 'terreno' : 'terrenos'}
      </p>
    </div>
  )
}
