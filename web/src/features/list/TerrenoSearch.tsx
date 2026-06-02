type TerrenoSearchProps = {
  query: string
  count: number
  onQuery: (value: string) => void
}

export function TerrenoSearch({ query, count, onQuery }: TerrenoSearchProps) {
  return (
    <div className="flex flex-col gap-2.5 px-4 pb-3 pt-4">
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Buscar por endereço"
        className="h-11 w-full rounded-sm border-b-2 border-line bg-paper px-3 text-base text-ink outline-none transition-colors placeholder:text-taupe/50 focus:border-moss"
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-taupe">
        {count} {count === 1 ? 'terreno' : 'terrenos'}
      </p>
    </div>
  )
}
