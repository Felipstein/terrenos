import { cn } from '../../lib/cn'
import type { ImageUpload } from './types'

type ImageThumbProps = {
  item: ImageUpload
  isPrincipal: boolean
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onSetPrincipal: (id: string) => void
}

export function ImageThumb({ item, isPrincipal, onRetry, onRemove, onSetPrincipal }: ImageThumbProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-sm border border-line bg-paper">
      <img src={item.url ?? item.previewUrl} alt="" className="h-full w-full object-cover" />

      {item.status === 'uploading' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/45 text-paper">
          <span className="font-mono text-xs font-semibold">{item.progress}%</span>
          <div className="h-1 w-3/4 overflow-hidden rounded-full bg-paper/30">
            <div className="h-full bg-paper transition-[width]" style={{ width: `${item.progress}%` }} />
          </div>
        </div>
      ) : null}

      {item.status === 'error' ? (
        <button
          type="button"
          onClick={() => onRetry(item.id)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-clay/85 text-paper"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8m0-5v5h-5" />
          </svg>
          <span className="text-[11px] font-semibold">Tentar de novo</span>
        </button>
      ) : null}

      {item.status === 'done' ? (
        <>
          <button
            type="button"
            aria-label="Remover foto"
            onClick={() => onRemove(item.id)}
            className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-sm bg-ink/55 text-paper transition-colors hover:bg-ink/80"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Definir como principal"
            onClick={() => onSetPrincipal(item.id)}
            className={cn(
              'absolute bottom-1 left-1 flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
              isPrincipal ? 'bg-clay text-paper' : 'bg-ink/55 text-paper hover:bg-ink/80',
            )}
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill={isPrincipal ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
            </svg>
            {isPrincipal ? 'Principal' : 'Tornar'}
          </button>
        </>
      ) : null}
    </div>
  )
}
