import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  label: string
}

export function IconButton({ label, className, type, ...props }: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-label={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-sm text-ink/70 transition-colors hover:bg-ink/5 active:bg-ink/10',
        className,
      )}
      {...props}
    />
  )
}
