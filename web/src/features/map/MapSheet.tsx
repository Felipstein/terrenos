import type { Terreno } from '../../types/terreno'
import type { Corretora } from '../../types/corretora'
import type { SortOrder, CornerFilter } from '../../lib/terreno-filters'
import { DraggableSheet } from '../../components/DraggableSheet/DraggableSheet'
import { TerrenoSearch } from '../list/TerrenoSearch'
import { TerrenoTable } from '../list/TerrenoTable'
import { AddTerrenoButton } from './AddTerrenoButton'

type MapSheetProps = {
  terrenos: Terreno[]
  selectedId: string | null
  query: string
  sort: SortOrder
  corretoras: Corretora[]
  corretora: string
  corner: CornerFilter
  onQuery: (value: string) => void
  onSort: (sort: SortOrder) => void
  onCorretora: (value: string) => void
  onCorner: (value: CornerFilter) => void
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  onAdd: () => void
}

export function MapSheet({
  terrenos,
  selectedId,
  query,
  sort,
  corretoras,
  corretora,
  corner,
  onQuery,
  onSort,
  onCorretora,
  onCorner,
  onSelect,
  onHover,
  onAdd,
}: MapSheetProps) {
  return (
    <DraggableSheet
      peekHeight={150}
      header={
        <TerrenoSearch
          query={query}
          count={terrenos.length}
          corretoras={corretoras}
          corretora={corretora}
          corner={corner}
          onQuery={onQuery}
          onCorretora={onCorretora}
          onCorner={onCorner}
        />
      }
      accessory={<AddTerrenoButton onClick={onAdd} />}
    >
      <TerrenoTable
        terrenos={terrenos}
        selectedId={selectedId}
        sort={sort}
        onSort={onSort}
        onSelect={onSelect}
        onHover={onHover}
      />
    </DraggableSheet>
  )
}
