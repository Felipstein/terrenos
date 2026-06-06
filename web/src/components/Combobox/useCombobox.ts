import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import type { ComboboxOption } from './Combobox'

// Normaliza pra busca case/acento-insensitive (mesma ideia do slug).
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

type Params = {
  value: string
  options: ComboboxOption[]
  onChange: (value: string) => void
  allowFreeText: boolean
}

/**
 * Lógica do Combobox: abertura, filtro e highlight por teclado. Os refs (DOM)
 * ficam no componente — o hook só lida com estado, pra não "vazar" ref no render.
 * `typed` distingue "acabou de abrir" (mostra todas) de "está digitando" (filtra).
 */
export function useCombobox({ value, options, onChange, allowFreeText }: Params) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [typed, setTyped] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()

  const selectedLabel = useMemo(() => {
    const found = options.find((option) => option.value === value)
    if (found) return found.label
    return allowFreeText ? value : ''
  }, [options, value, allowFreeText])

  const filtered = useMemo(() => {
    const q = typed ? normalize(query) : ''
    if (!q) return options
    return options.filter((option) => normalize(option.label).includes(q))
  }, [options, query, typed])

  function openList() {
    setQuery(selectedLabel)
    setTyped(false)
    setActive(-1)
    setOpen(true)
  }

  function close() {
    setOpen(false)
    setTyped(false)
    setQuery('')
  }

  function handleInput(text: string) {
    setOpen(true)
    setTyped(true)
    setQuery(text)
    setActive(-1)
    if (allowFreeText) onChange(text)
  }

  function select(option: ComboboxOption) {
    onChange(option.value)
    close()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) return openList()
      if (filtered.length === 0) return
      setActive((i) => (i >= filtered.length - 1 ? 0 : i + 1)) // -1 → 0; wrap no fim
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (filtered.length === 0) return
      setActive((i) => (i <= 0 ? filtered.length - 1 : i - 1)) // -1/0 → último; wrap no topo
    } else if (event.key === 'Enter') {
      if (!open) return
      event.preventDefault()
      if (active >= 0 && filtered[active]) select(filtered[active])
      else close() // mantém o texto livre já comitado (form) ou não muda (filtro)
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        close()
      }
    }
  }

  return {
    open,
    inputValue: open ? query : selectedLabel,
    filtered,
    active,
    setActive,
    listId,
    selectedValue: value,
    openList,
    close,
    handleInput,
    select,
    onKeyDown,
  }
}
