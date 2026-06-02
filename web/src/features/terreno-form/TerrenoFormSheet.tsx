import type { Terreno, TerrenoInput } from '../../types/terreno'
import {
  BottomSheetBackdrop,
  BottomSheetPanel,
  BottomSheetRoot,
} from '../../components/BottomSheet'
import { IconButton } from '../../components/IconButton/IconButton'
import { TerrenoForm } from './TerrenoForm'

type TerrenoFormSheetProps = {
  open: boolean
  terreno: Terreno | null
  centerLat: number
  centerLng: number
  onClose: () => void
  onSubmit: (input: TerrenoInput, id: string | null) => void
}

export function TerrenoFormSheet({
  open,
  terreno,
  centerLat,
  centerLng,
  onClose,
  onSubmit,
}: TerrenoFormSheetProps) {
  return (
    <BottomSheetRoot open={open} onClose={onClose}>
      <BottomSheetBackdrop />
      <BottomSheetPanel>
        {open ? (
          <div className="flex flex-col">
            <header className="flex items-center justify-between px-5 pb-3 pt-3 md:pt-5">
              <h2 className="font-serif text-lg font-semibold text-ink">
                {terreno ? 'Editar terreno' : 'Novo terreno'}
              </h2>
              <IconButton label="Fechar" onClick={onClose}>
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
                onSubmit={(input) => {
                  onSubmit(input, terreno?.id ?? null)
                  onClose()
                }}
              />
            </div>
          </div>
        ) : null}
      </BottomSheetPanel>
    </BottomSheetRoot>
  )
}
