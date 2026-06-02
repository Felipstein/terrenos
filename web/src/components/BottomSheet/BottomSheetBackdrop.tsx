import { cn } from '../../lib/cn'
import { useBottomSheet } from './BottomSheetContext'

export function BottomSheetBackdrop() {
  const { open, onClose } = useBottomSheet()
  return (
    <button
      type="button"
      aria-label="Fechar"
      tabIndex={open ? 0 : -1}
      onClick={onClose}
      className={cn(
        'absolute inset-0 bg-ink/40 transition-opacity duration-300',
        open ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}
