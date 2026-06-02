import { type ReactNode, useEffect } from 'react'
import { cn } from '../../lib/cn'
import { BottomSheetContext } from './BottomSheetContext'

type BottomSheetRootProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheetRoot({ open, onClose, children }: BottomSheetRootProps) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <BottomSheetContext.Provider value={{ open, onClose }}>
      <div
        className={cn(
          'fixed inset-0 z-[1100] transition-opacity duration-300',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        {children}
      </div>
    </BottomSheetContext.Provider>
  )
}
