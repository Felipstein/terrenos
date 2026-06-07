import { useState } from 'react'
import type { Terreno, TerrenoInput } from '../../types/terreno'
import { useTerrenos } from '../../hooks/useTerrenos'
import { useCorretoras } from '../../hooks/useCorretoras'
import {
  filterTerrenos,
  sortTerrenos,
  type SortOrder,
  type CornerFilter,
} from '../../lib/terreno-filters'
import { MapView } from '../map/MapView'
import { MapSheet } from '../map/MapSheet'
import { DEFAULT_CENTER } from '../map/config'
import { SidePanel } from './SidePanel'
import { TerrenoSheet } from '../terreno-detail/TerrenoSheet'
import { TerrenoFormSheet } from '../terreno-form/TerrenoFormSheet'
import { CorretorasSheet } from '../corretoras/CorretorasSheet'
import { AlertDialog } from '../../components/AlertDialog/AlertDialog'

type AppShellProps = {
  onLogout: () => void
}

export function AppShell({ onLogout }: AppShellProps) {
  const { terrenos, loading, addTerreno, updateTerreno, removeTerreno } = useTerrenos()
  const { corretoras, refresh: refreshCorretoras, update: updateCorretora } = useCorretoras()
  const [query, setQuery] = useState('')
  const [corretora, setCorretora] = useState('')
  const [corner, setCorner] = useState<CornerFilter>('all')
  const [sort, setSort] = useState<SortOrder>('price-asc')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [corretorasOpen, setCorretorasOpen] = useState(false)
  const [editing, setEditing] = useState<Terreno | null>(null)
  const [createAt, setCreateAt] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER)
  const [addMode, setAddMode] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const searched = filterTerrenos(terrenos, query, corretora, corner) // mapa: ordem estável (sem piscar)
  const visible = sortTerrenos(searched, sort) // tabela: ordenada
  const selected = terrenos.find((terreno) => terreno.id === selectedId) ?? null
  const deleting = terrenos.find((terreno) => terreno.id === deletingId) ?? null
  const focus = selected ? { lat: selected.lat, lng: selected.lng } : null

  // O FAB/"+ Novo" entra no modo de adição (mira no centro do mapa). A criação
  // só acontece quando o usuário confirma com "Criar aqui", lendo o centro do
  // mapa, abrindo o form já com a coordenada/endereço pré-preenchidos.
  function enterAddMode() {
    setSelectedId(null)
    setAddMode(true)
  }

  function confirmCreate(lat: number, lng: number) {
    setAddMode(false)
    setEditing(null)
    setCreateAt({ lat, lng })
    setFormOpen(true)
  }

  function openEdit(terreno: Terreno) {
    setSelectedId(null)
    setEditing(terreno)
    setFormOpen(true)
  }

  async function handleSubmit(input: TerrenoInput, id: string | null) {
    if (id) {
      await updateTerreno({ ...input, id })
    } else {
      const created = await addTerreno(input)
      setSelectedId(created.id) // abre o detalhe do recém-criado
    }
    void refreshCorretoras() // corretora nova digitada já aparece no autocomplete/filtro
    setFormOpen(false) // só fecha o form quando terminou de salvar
  }

  async function confirmDelete() {
    if (!deletingId || deleteLoading) return
    setDeleteLoading(true)
    try {
      await removeTerreno(deletingId)
      setSelectedId(null)
      setDeletingId(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <SidePanel
        terrenos={visible}
        selectedId={selectedId}
        query={query}
        sort={sort}
        corretoras={corretoras}
        corretora={corretora}
        corner={corner}
        onQuery={setQuery}
        onSort={setSort}
        onCorretora={setCorretora}
        onCorner={setCorner}
        onSelect={setSelectedId}
        onHover={setHoveredId}
        onAdd={enterAddMode}
        onManageCorretoras={() => setCorretorasOpen(true)}
        onLogout={onLogout}
      />

      <div className="absolute inset-0 md:static md:flex-1">
        <MapView
          terrenos={searched}
          loading={loading}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          focus={focus}
          addMode={addMode}
          onConfirmCreate={confirmCreate}
          onCancelAdd={() => setAddMode(false)}
        />

        {!addMode ? (
          <div className="absolute right-4 top-4 z-[1000] flex gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setCorretorasOpen(true)}
              className="rounded-sm bg-surface/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-taupe shadow-sm ring-1 ring-line backdrop-blur active:bg-paper"
            >
              Corretoras
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-sm bg-surface/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-taupe shadow-sm ring-1 ring-line backdrop-blur active:bg-paper"
            >
              Sair
            </button>
          </div>
        ) : null}
      </div>

      {!addMode ? (
        <div className="md:hidden">
          <MapSheet
            terrenos={visible}
            selectedId={selectedId}
            query={query}
            sort={sort}
            corretoras={corretoras}
            corretora={corretora}
            corner={corner}
            onQuery={setQuery}
            onSort={setSort}
            onCorretora={setCorretora}
            onCorner={setCorner}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            onAdd={enterAddMode}
          />
        </div>
      ) : null}

      <TerrenoSheet
        terreno={selected}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onEdit={openEdit}
        onDelete={setDeletingId}
      />

      <TerrenoFormSheet
        open={formOpen}
        terreno={editing}
        centerLat={createAt.lat}
        centerLng={createAt.lng}
        corretoras={corretoras}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <CorretorasSheet
        open={corretorasOpen}
        corretoras={corretoras}
        onClose={() => setCorretorasOpen(false)}
        onSave={updateCorretora}
      />

      <AlertDialog
        open={deletingId !== null}
        title="Excluir terreno"
        description={
          deleting
            ? `Tem certeza que quer excluir "${deleting.rua}"? Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        loading={deleteLoading}
        loadingLabel="Excluindo…"
        onConfirm={confirmDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}
