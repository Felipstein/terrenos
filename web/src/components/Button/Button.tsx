import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'accent' | 'ghost'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-moss text-paper hover:bg-moss-700 active:bg-moss',
  accent: 'bg-clay text-paper hover:bg-clay-600 active:bg-clay',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10',
}

export function Button({ variant = 'primary', className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
