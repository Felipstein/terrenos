import { useState, type MouseEvent } from 'react'
import type { Terreno } from '../../types/terreno'
import { displayPrice } from '../../lib/format'
import { imagemPrincipal } from '../../lib/imagem'
import { cn } from '../../lib/cn'
import { RowImagePreview } from './RowImagePreview'

type TerrenoTableRowProps = {
  terreno: Terreno
  selected: boolean
  onSelect: (id: string) => void
}

export function TerrenoTableRow({ terreno, selected, onSelect }: TerrenoTableRowProps) {
  const [preview, setPreview] = useState<{ top: number; left: number } | null>(null)
  const dim =
    terreno.largura && terreno.comprimento ? `${terreno.largura}×${terreno.comprimento}` : '—'
  const hasImage = Boolean(imagemPrincipal(terreno))

  function handleEnter(event: MouseEvent<HTMLTableRowElement>) {
    if (!hasImage) return
    const rect = event.currentTarget.getBoundingClientRect()
    setPreview({ top: rect.top, left: rect.right + 8 })
  }

  return (
    <tr
      onClick={() => onSelect(terreno.id)}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setPreview(null)}
      className={cn(
        'cursor-pointer border-b border-line/70 transition-colors',
        selected ? 'bg-clay/10' : 'hover:bg-ink/[0.03]',
      )}
    >
      <td className="px-4 py-3.5">
        <span className="block truncate text-sm text-ink">{terreno.rua}</span>
        {preview ? <RowImagePreview terreno={terreno} top={preview.top} left={preview.left} /> : null}
      </td>
      <td className="whitespace-nowrap px-2 py-3.5 text-right font-mono text-xs tabular-nums text-taupe">
        {terreno.areaTotal} m²
      </td>
      <td className="px-2 py-3.5 text-right font-mono text-xs tabular-nums text-taupe">{dim}</td>
      <td
        className={cn(
          'whitespace-nowrap px-4 py-3.5 text-right font-mono text-[13px] tabular-nums',
          terreno.preco === undefined ? 'font-medium text-taupe' : 'font-semibold text-ink',
        )}
      >
        {displayPrice(terreno.preco)}
      </td>
    </tr>
  )
}
