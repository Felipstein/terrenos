import type { Terreno } from '../../types/terreno'
import {
  BottomSheetBackdrop,
  BottomSheetPanel,
  BottomSheetRoot,
} from '../../components/BottomSheet'
import { Button } from '../../components/Button/Button'
import { formatPrice } from '../../lib/format'
import { TerrenoInfo } from './TerrenoInfo'
import { RouteButton } from './RouteButton'

type TerrenoSheetProps = {
  terreno: Terreno | null
  open: boolean
  onClose: () => void
  onEdit: (terreno: Terreno) => void
  onDelete: (id: string) => void
}

export function TerrenoSheet({ terreno, open, onClose, onEdit, onDelete }: TerrenoSheetProps) {
  return (
    <BottomSheetRoot open={open} onClose={onClose}>
      <BottomSheetBackdrop />
      <BottomSheetPanel>
        {terreno ? (
          <div className="flex flex-col gap-5 pb-8 pt-3 md:pt-5">
            <div className="px-5">
              <p className="font-mono text-3xl font-semibold tracking-tight text-ink">
                {formatPrice(terreno.preco)}
              </p>
              <p className="mt-1 font-serif text-base text-moss">{terreno.rua}</p>
            </div>

            <TerrenoInfo terreno={terreno} />

            <div className="flex flex-col gap-2 px-5">
              <RouteButton lat={terreno.lat} lng={terreno.lng} />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 border border-line"
                  onClick={() => onEdit(terreno)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 border border-line text-clay hover:bg-clay/5"
                  onClick={() => onDelete(terreno.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </BottomSheetPanel>
    </BottomSheetRoot>
  )
}
