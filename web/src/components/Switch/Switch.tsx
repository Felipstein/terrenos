import { useId } from 'react'

type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  id?: string
}

// Toggle sim/não, estilo "papel" alinhado aos tokens do app (moss quando ligado).
// Acessível: usa role=switch e aria-checked, alvo de toque >= 44px.
export function Switch({ label, checked, onChange, description, id }: SwitchProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId
  return (
    <label
      htmlFor={switchId}
      className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-sm bg-paper px-1 py-2"
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-ink">{label}</span>
        {description ? <span className="text-xs text-taupe">{description}</span> : null}
      </span>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          checked ? 'border-moss bg-moss' : 'border-line bg-surface'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}
