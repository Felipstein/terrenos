import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useBottomSheet } from './BottomSheetContext'

type BottomSheetPanelProps = {
  children: ReactNode
}

// Mobile: bottom sheet que sobe. Desktop: modal centralizado com largura limitada.
export function BottomSheetPanel({ children }: BottomSheetPanelProps) {
  const { open } = useBottomSheet()
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        'absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl border-t border-line bg-surface shadow-[0_-8px_40px_rgba(33,29,21,0.18)] transition-[transform,opacity] duration-300 ease-out',
        'md:inset-0 md:m-auto md:h-fit md:max-h-[85vh] md:max-w-lg md:rounded-lg md:border',
        open ? 'translate-y-0 md:opacity-100' : 'translate-y-full md:translate-y-0 md:opacity-0',
      )}
    >
      <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line md:hidden" />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  )
}
