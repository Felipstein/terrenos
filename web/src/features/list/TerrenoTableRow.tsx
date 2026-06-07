import { useState, type MouseEvent } from 'react'
import type { Terreno } from '../../types/terreno'
import { displayPriceShort, displayPricePerSqm, displayArea, pricePerSquareMeter } from '../../lib/format'
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
    terreno.largura && terreno.comprimento ? `${terreno.largura}×${terreno.comprimento}` : null
  const perSqm = pricePerSquareMeter(terreno.preco, terreno.areaTotal)
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
      <td className="px-3 py-3">
        <span className="block truncate text-sm text-ink">{terreno.rua}</span>
        {preview ? <RowImagePreview terreno={terreno} top={preview.top} left={preview.left} /> : null}
      </td>
      <td className="whitespace-nowrap px-1.5 py-3 text-right">
        <span className="block font-mono text-xs tabular-nums text-taupe">
          {displayArea(terreno.areaTotal)}
        </span>
        {dim ? (
          <span className="block font-mono text-[10px] tabular-nums text-taupe/70">{dim}</span>
        ) : null}
      </td>
      <td
        className={cn(
          'whitespace-nowrap px-1.5 py-3 text-right font-mono text-xs tabular-nums',
          terreno.preco === undefined ? 'font-medium text-taupe' : 'font-semibold text-ink',
        )}
      >
        {displayPriceShort(terreno.preco)}
      </td>
      <td
        className={cn(
          'whitespace-nowrap px-1.5 py-3 text-right font-mono text-xs tabular-nums',
          perSqm === undefined ? 'text-taupe/70' : 'text-taupe',
        )}
      >
        {displayPricePerSqm(perSqm)}
      </td>
    </tr>
  )
}
