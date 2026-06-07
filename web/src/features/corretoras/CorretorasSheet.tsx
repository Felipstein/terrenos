import { useState } from 'react'
import type { Corretora, CorretoraUpdateInput } from '../../types/corretora'
import {
  BottomSheetBackdrop,
  BottomSheetPanel,
  BottomSheetRoot,
} from '../../components/BottomSheet'
import { IconButton } from '../../components/IconButton/IconButton'
import { CorretoraEditForm } from './CorretoraEditForm'

type CorretorasSheetProps = {
  open: boolean
  corretoras: Corretora[]
  onClose: () => void
  onSave: (slug: string, input: CorretoraUpdateInput) => Promise<Corretora>
}

// Gerência de corretoras: lista as da conta e abre a edição (nome + telefone)
// de qualquer uma — inclusive antigas/auto-criadas, pra completar o telefone.
export function CorretorasSheet({ open, corretoras, onClose, onSave }: CorretorasSheetProps) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const editing = corretoras.find((c) => c.slug === editingSlug) ?? null

  // Fecha voltando pra lista, pra a próxima abertura não cair direto na edição.
  function handleClose() {
    setEditingSlug(null)
    onClose()
  }

  async function handleSave(slug: string, input: CorretoraUpdateInput) {
    await onSave(slug, input)
    setEditingSlug(null)
  }

  return (
    <BottomSheetRoot open={open} onClose={handleClose}>
      <BottomSheetBackdrop />
      <BottomSheetPanel>
        {open ? (
          <div className="flex flex-col">
            <header className="flex items-center gap-2 px-5 pb-3 pt-3 md:pt-5">
              {editing ? (
                <IconButton label="Voltar" onClick={() => setEditingSlug(null)}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </IconButton>
              ) : null}
              <h2 className="flex-1 font-serif text-lg font-semibold text-ink">
                {editing ? 'Editar corretora' : 'Corretoras'}
              </h2>
              <IconButton label="Fechar" onClick={handleClose}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </IconButton>
            </header>

            <div className="px-5 pb-6">
              {editing ? (
                <CorretoraEditForm corretora={editing} onSubmit={handleSave} />
              ) : corretoras.length === 0 ? (
                <p className="py-8 text-center text-sm text-taupe">
                  Nenhuma corretora ainda. Elas aparecem aqui ao cadastrar um terreno com corretora.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {corretoras.map((corretora) => (
                    <li key={corretora.slug}>
                      <button
                        type="button"
                        onClick={() => setEditingSlug(corretora.slug)}
                        className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-paper"
                      >
                        <span className="flex flex-col">
                          <span className="text-base text-ink">{corretora.name}</span>
                          <span className="font-mono text-xs text-taupe">
                            {corretora.phone ?? 'Sem telefone'}
                          </span>
                        </span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-taupe" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </BottomSheetPanel>
    </BottomSheetRoot>
  )
}
