import type { ChangeEvent } from 'react'
import { cn } from '../../lib/cn'

type CurrencyFieldProps = {
  id?: string
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
}

// Campo de dinheiro estilo "Nubank": valor grande, R$ fixo, formata os milhares
// enquanto digita. Guarda o valor como number.
export function CurrencyField({ id, label, value, onChange, error }: CurrencyFieldProps) {
  const display =
    value === undefined || Number.isNaN(value) ? '' : value.toLocaleString('pt-BR')

  function handle(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '')
    onChange(digits === '' ? undefined : Number(digits))
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-taupe">
        {label}
      </span>
      <div
        className={cn(
          'flex items-baseline gap-2 rounded-sm border-b-2 bg-paper px-3 py-2.5 transition-colors',
          error ? 'border-clay' : 'border-line focus-within:border-moss',
        )}
      >
        <span className="font-mono text-lg font-medium text-taupe">R$</span>
        <input
          id={id}
          inputMode="numeric"
          value={display}
          onChange={handle}
          placeholder="0"
          className="w-full bg-transparent font-mono text-3xl font-semibold tabular-nums text-ink outline-none placeholder:text-taupe/40"
        />
      </div>
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </label>
  )
}
