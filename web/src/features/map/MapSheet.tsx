import type { Terreno } from '../../types/terreno'
import type { SortOrder } from '../../lib/terreno-filters'
import { DraggableSheet } from '../../components/DraggableSheet/DraggableSheet'
import { TerrenoSearch } from '../list/TerrenoSearch'
import { TerrenoTable } from '../list/TerrenoTable'
import { AddTerrenoButton } from './AddTerrenoButton'

type MapSheetProps = {
  terrenos: Terreno[]
  selectedId: string | null
  query: string
  sort: SortOrder
  onQuery: (value: string) => void
  onSort: (sort: SortOrder) => void
  onSelect: (id: string) => void
  onAdd: () => void
}

export function MapSheet({
  terrenos,
  selectedId,
  query,
  sort,
  onQuery,
  onSort,
  onSelect,
  onAdd,
}: MapSheetProps) {
  return (
    <DraggableSheet
      peekHeight={150}
      header={<TerrenoSearch query={query} count={terrenos.length} onQuery={onQuery} />}
      accessory={<AddTerrenoButton onClick={onAdd} />}
    >
      <TerrenoTable
        terrenos={terrenos}
        selectedId={selectedId}
        sort={sort}
        onSort={onSort}
        onSelect={onSelect}
      />
    </DraggableSheet>
  )
}
