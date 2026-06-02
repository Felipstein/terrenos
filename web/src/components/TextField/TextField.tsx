import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

// Estilo "papel": campo preenchido (bg-paper) com linha inferior que acende no
// foco. React 19: {...register('x')} flui pro input. Skill `forms`.
export function TextField({ label, error, id, className, ...props }: TextFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-taupe">
        {label}
      </span>
      <input
        id={id}
        className={cn(
          'h-12 rounded-sm border-b-2 bg-paper px-3 text-base text-ink outline-none transition-colors placeholder:text-taupe/50',
          error ? 'border-clay' : 'border-line focus:border-moss',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </label>
  )
}
