type AddTerrenoButtonProps = {
  onClick: () => void
}

// Botão redondo de adicionar. O posicionamento é responsabilidade de quem usa
// (no mobile vai grudado no topo da gaveta, subindo junto com ela).
export function AddTerrenoButton({ onClick }: AddTerrenoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Adicionar terreno"
      className="grid h-14 w-14 place-items-center rounded-md bg-moss text-paper shadow-lg ring-1 ring-ink/10 transition-transform hover:bg-moss-700 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  )
}
