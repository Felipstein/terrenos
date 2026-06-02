import type { Terreno } from '../../types/terreno'
import type { SortOrder } from '../../lib/terreno-filters'
import { Button } from '../../components/Button/Button'
import { TerrenoSearch } from '../list/TerrenoSearch'
import { TerrenoTable } from '../list/TerrenoTable'

type SidePanelProps = {
  terrenos: Terreno[]
  selectedId: string | null
  query: string
  sort: SortOrder
  onQuery: (value: string) => void
  onSort: (sort: SortOrder) => void
  onSelect: (id: string) => void
  onAdd: () => void
  onLogout: () => void
}

// Painel lateral do desktop (escondido no mobile, onde vale a gaveta).
export function SidePanel({
  terrenos,
  selectedId,
  query,
  sort,
  onQuery,
  onSort,
  onSelect,
  onAdd,
  onLogout,
}: SidePanelProps) {
  return (
    <aside className="hidden h-full w-[420px] shrink-0 flex-col border-r border-line bg-surface md:flex">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 pb-3 pt-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold leading-none text-ink">Terrenos</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-taupe">
            mapa &amp; cadastro
          </p>
        </div>
        <Button className="h-9 px-3 text-xs" onClick={onAdd}>
          + Novo
        </Button>
      </header>

      <TerrenoSearch query={query} count={terrenos.length} onQuery={onQuery} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <TerrenoTable
          terrenos={terrenos}
          selectedId={selectedId}
          sort={sort}
          onSort={onSort}
          onSelect={onSelect}
        />
      </div>

      <footer className="border-t border-line px-4 py-2.5">
        <button
          type="button"
          onClick={onLogout}
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-taupe transition-colors hover:text-clay"
        >
          Sair
        </button>
      </footer>
    </aside>
  )
}
