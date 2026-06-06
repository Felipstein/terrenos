import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button/Button'

const trashIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4h8v2m1 0v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6m3 4v6m4-6v6" />
  </svg>
)

type AlertDialogProps = {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  icon?: ReactNode
  /** Em andamento (ex: excluindo): trava os botões/fechamento e mostra o loadingLabel. */
  loading?: boolean
  loadingLabel?: string
  onConfirm: () => void
  onClose: () => void
}

// Diálogo de confirmação (centralizado, mobile e desktop). Por padrão é
// destrutivo (ícone de lixeira); passe `icon` pra outros contextos.
export function AlertDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  icon = trashIcon,
  loading = false,
  loadingLabel,
  onConfirm,
  onClose,
}: AlertDialogProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[1200] flex items-center justify-center p-5 transition-opacity duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={open ? 0 : -1}
        disabled={loading}
        onClick={() => {
          if (!loading) onClose()
        }}
        className="absolute inset-0 bg-ink/50"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          'relative w-full max-w-sm rounded-lg border border-line bg-surface p-5 shadow-[0_20px_60px_rgba(33,29,21,0.28)] transition-transform duration-200',
          open ? 'scale-100' : 'scale-95',
        )}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-clay/12 text-clay">
            {icon}
          </div>
          <div className="min-w-0 pt-0.5">
            <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm text-taupe">{description}</p> : null}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" className="border border-line" disabled={loading} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="accent" disabled={loading} onClick={onConfirm}>
            {loading ? (loadingLabel ?? confirmLabel) : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
