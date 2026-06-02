import { useState } from 'react'
import type { TerrenoImagem } from '../../types/terreno'
import { cn } from '../../lib/cn'

type TerrenoGalleryProps = {
  imagens: TerrenoImagem[]
  principalId?: string
}

export function TerrenoGallery({ imagens, principalId }: TerrenoGalleryProps) {
  const principal = imagens.find((img) => img.id === principalId) ?? imagens[0]
  const [activeId, setActiveId] = useState(principal.id)
  const active = imagens.find((img) => img.id === activeId) ?? principal

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-5 overflow-hidden rounded-sm border border-line">
        <img src={active.url} alt="" className="h-56 w-full object-cover" />
      </div>
      {imagens.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {imagens.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={cn(
                'h-14 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-colors',
                img.id === activeId ? 'border-clay' : 'border-line',
              )}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
