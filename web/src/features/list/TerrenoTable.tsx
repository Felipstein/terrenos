import type { Terreno } from '../../types/terreno'
import type { SortOrder } from '../../lib/terreno-filters'
import { cn } from '../../lib/cn'
import { TerrenoTableRow } from './TerrenoTableRow'

type TerrenoTableProps = {
  terrenos: Terreno[]
  selectedId: string | null
  sort: SortOrder
  onSort: (sort: SortOrder) => void
  onSelect: (id: string) => void
}

type SortField = 'price' | 'area' | 'pricePerSqm'

function arrow(active: boolean, asc: boolean): string {
  if (!active) return '↕'
  return asc ? '↑' : '↓'
}

export function TerrenoTable({ terrenos, selectedId, sort, onSort, onSelect }: TerrenoTableProps) {
  function toggle(field: SortField) {
    const asc = `${field}-asc` as SortOrder
    const desc = `${field}-desc` as SortOrder
    onSort(sort === asc ? desc : asc)
  }

  const areaActive = sort.startsWith('area')
  const priceActive = sort.startsWith('price-')
  const perSqmActive = sort.startsWith('pricePerSqm')

  if (terrenos.length === 0) {
    return <p className="p-8 text-center text-sm text-taupe">Nenhum terreno encontrado.</p>
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        <col />
        <col className="w-[68px]" />
        <col className="w-[88px]" />
        <col className="w-[84px]" />
      </colgroup>
      <thead className="sticky top-0 z-10 bg-surface">
        <tr className="border-b border-line text-[10px] uppercase tracking-[0.06em] text-taupe">
          <th className="px-3 py-2.5 text-left font-semibold">Endereço</th>
          <th className="px-1.5 py-2.5 text-right font-semibold">
            <button
              type="button"
              onClick={() => toggle('area')}
              className={cn('inline-flex items-center gap-0.5', areaActive ? 'text-clay' : 'hover:text-ink')}
            >
              Área <span className="font-mono text-[11px]">{arrow(areaActive, sort === 'area-asc')}</span>
            </button>
          </th>
          <th className="px-1.5 py-2.5 text-right font-semibold">
            <button
              type="button"
              onClick={() => toggle('price')}
              className={cn('inline-flex items-center gap-0.5', priceActive ? 'text-clay' : 'hover:text-ink')}
            >
              Preço <span className="font-mono text-[11px]">{arrow(priceActive, sort === 'price-asc')}</span>
            </button>
          </th>
          <th className="px-3 py-2.5 text-right font-semibold">
            <button
              type="button"
              onClick={() => toggle('pricePerSqm')}
              className={cn('inline-flex items-center gap-0.5', perSqmActive ? 'text-clay' : 'hover:text-ink')}
            >
              R$/m² <span className="font-mono text-[11px]">{arrow(perSqmActive, sort === 'pricePerSqm-asc')}</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {terrenos.map((terreno) => (
          <TerrenoTableRow
            key={terreno.id}
            terreno={terreno}
            selected={terreno.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </tbody>
    </table>
  )
}
