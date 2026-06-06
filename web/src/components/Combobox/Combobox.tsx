import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { useCombobox } from './useCombobox'

export type ComboboxOption = { value: string; label: string }

type ComboboxProps = {
  id: string
  label?: string
  value: string
  options: ComboboxOption[]
  onChange: (value: string) => void
  /** true: aceita texto novo (ex: cadastrar corretora). false: só escolher da lista (filtro). */
  allowFreeText?: boolean
  placeholder?: string
  emptyLabel?: string
  error?: string
}

// Combobox/autocomplete acessível e mobile-first. Sem dependência externa.
export function Combobox({
  id,
  label,
  value,
  options,
  onChange,
  allowFreeText = false,
  placeholder,
  emptyLabel = 'Nenhuma opção',
  error,
}: ComboboxProps) {
  const c = useCombobox({ value, options, onChange, allowFreeText })
  const rootRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)
  const { open, close } = c

  // Fecha ao clicar/tocar fora.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, close])

  // Mantém o item destacado visível ao navegar pelo teclado.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [c.active])

  return (
    <div ref={rootRef} className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.09em] text-taupe">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={c.open}
          aria-controls={c.listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={c.inputValue}
          placeholder={placeholder}
          onChange={(event) => c.handleInput(event.target.value)}
          onFocus={(event) => {
            c.openList()
            event.target.select()
          }}
          onKeyDown={c.onKeyDown}
          className={cn(
            'h-11 w-full rounded-sm border-b-2 bg-paper pl-3 pr-9 text-base text-ink outline-none transition-colors placeholder:text-taupe/50',
            error ? 'border-clay' : 'border-line focus:border-moss',
          )}
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe transition-transform',
            c.open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>

        {c.open ? (
          <ul
            id={c.listId}
            role="listbox"
            className="absolute left-0 right-0 z-[1300] mt-1 max-h-56 overflow-y-auto overscroll-contain rounded-sm border border-line bg-surface py-1 shadow-[0_12px_32px_rgba(33,29,21,0.18)]"
          >
            {c.filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-taupe">{emptyLabel}</li>
            ) : (
              c.filtered.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === c.selectedValue}
                  ref={index === c.active ? activeRef : undefined}
                  onMouseEnter={() => c.setActive(index)}
                  onPointerDown={(event) => {
                    event.preventDefault() // evita blur antes do clique
                    c.select(option)
                  }}
                  className={cn(
                    'flex min-h-[44px] cursor-pointer items-center px-3 text-sm',
                    index === c.active ? 'bg-moss text-paper' : 'text-ink',
                  )}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      {error ? <span className="text-xs text-clay">{error}</span> : null}
    </div>
  )
}
