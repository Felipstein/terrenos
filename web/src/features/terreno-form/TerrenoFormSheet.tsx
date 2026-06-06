import { useRef, useState } from 'react'
import type { Terreno, TerrenoInput } from '../../types/terreno'
import type { Corretora } from '../../types/corretora'
import {
  BottomSheetBackdrop,
  BottomSheetPanel,
  BottomSheetRoot,
} from '../../components/BottomSheet'
import { IconButton } from '../../components/IconButton/IconButton'
import { AlertDialog } from '../../components/AlertDialog/AlertDialog'
import { TerrenoForm } from './TerrenoForm'

type TerrenoFormSheetProps = {
  open: boolean
  terreno: Terreno | null
  centerLat: number
  centerLng: number
  corretoras: Corretora[]
  onClose: () => void
  onSubmit: (input: TerrenoInput, id: string | null) => Promise<void>
}

const warningIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </svg>
)

export function TerrenoFormSheet({
  open,
  terreno,
  centerLat,
  centerLng,
  corretoras,
  onClose,
  onSubmit,
}: TerrenoFormSheetProps) {
  // dirtyRef é resetado a cada reabertura: o form remonta e dispara
  // onDirtyChange(false). confirmOpen sempre volta a false ao confirmar/cancelar.
  const dirtyRef = useRef(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Backdrop, ESC e o X caem aqui: só fecha direto se não há nada a perder.
  function requestClose() {
    if (dirtyRef.current) setConfirmOpen(true)
    else onClose()
  }

  function discard() {
    dirtyRef.current = false
    setConfirmOpen(false)
    onClose()
  }

  return (
    <>
      <BottomSheetRoot open={open} onClose={requestClose}>
        <BottomSheetBackdrop />
        <BottomSheetPanel>
          {open ? (
            <div className="flex flex-col">
              <header className="flex items-center justify-between px-5 pb-3 pt-3 md:pt-5">
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {terreno ? 'Editar terreno' : 'Novo terreno'}
                </h2>
                <IconButton label="Fechar" onClick={requestClose}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </IconButton>
              </header>
              <div className="px-5 pb-6">
                <TerrenoForm
                  initial={terreno}
                  centerLat={centerLat}
                  centerLng={centerLng}
                  corretoras={corretoras}
                  onDirtyChange={(dirty) => {
                    dirtyRef.current = dirty
                  }}
                  onSubmit={(input) => onSubmit(input, terreno?.id ?? null)}
                />
              </div>
            </div>
          ) : null}
        </BottomSheetPanel>
      </BottomSheetRoot>

      <AlertDialog
        open={confirmOpen}
        icon={warningIcon}
        title="Descartar alterações?"
        description="Você tem alterações não salvas neste terreno. Se sair agora, elas serão perdidas."
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        onConfirm={discard}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}
