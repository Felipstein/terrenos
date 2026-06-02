import { createContext, useContext } from 'react'

type BottomSheetContextValue = {
  open: boolean
  onClose: () => void
}

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null)

export function useBottomSheet(): BottomSheetContextValue {
  const value = useContext(BottomSheetContext)
  if (value === null) {
    throw new Error('Componentes de BottomSheet devem ficar dentro de <BottomSheetRoot>')
  }
  return value
}
