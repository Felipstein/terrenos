type InfoFieldProps = {
  label: string
  value: string
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-taupe">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-ink">{value}</p>
    </div>
  )
}
