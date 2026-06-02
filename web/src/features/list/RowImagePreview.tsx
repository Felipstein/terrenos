import type { Terreno } from '../../types/terreno'
import { imagemPrincipal, imagensSecundarias } from '../../lib/imagem'

type RowImagePreviewProps = {
  terreno: Terreno
  top: number
  left: number
}

// Card flutuante no hover de uma linha da tabela (desktop): foto principal +
// as demais pequenas embaixo. position: fixed pra escapar do overflow.
export function RowImagePreview({ terreno, top, left }: RowImagePreviewProps) {
  const principal = imagemPrincipal(terreno)
  if (!principal) return null
  const outras = imagensSecundarias(terreno)

  return (
    <div
      className="pointer-events-none fixed z-[1300] w-56 overflow-hidden rounded-sm border border-line bg-surface shadow-[0_12px_40px_rgba(33,29,21,0.25)]"
      style={{ top, left }}
    >
      <img src={principal.url} alt="" className="h-36 w-full object-cover" />
      {outras.length > 0 ? (
        <div className="flex gap-1 p-1.5">
          {outras.slice(0, 4).map((img) => (
            <img key={img.id} src={img.url} alt="" className="h-10 w-12 rounded-[2px] object-cover" />
          ))}
        </div>
      ) : null}
    </div>
  )
}
