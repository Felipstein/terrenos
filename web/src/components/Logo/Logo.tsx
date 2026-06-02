import { cn } from '../../lib/cn'

type LogoProps = {
  className?: string
}

// Marca do app: pin verde-musgo com miolo terracota (mesma do favicon).
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-7 w-7', className)} aria-hidden="true">
      <path
        d="M16 4.5c-4.5 0-8.2 3.6-8.2 8.1 0 5.7 8.2 14.4 8.2 14.4s8.2-8.7 8.2-14.4c0-4.5-3.7-8.1-8.2-8.1z"
        fill="#2f3a28"
      />
      <circle cx="16" cy="12.6" r="3.3" fill="#b6532e" />
    </svg>
  )
}
