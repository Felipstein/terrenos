import { useEffect, useRef, useState, type DragEvent } from 'react'
import { cn } from '../../lib/cn'
import type { ImageUpload } from './types'
import { ImageThumb } from './ImageThumb'

// Extrai os arquivos de imagem de um clipboard (ex: print copiado com Ctrl+C).
function imageFilesFromClipboard(data: DataTransfer | null): File[] {
  if (!data) return []
  const files: File[] = []
  for (let index = 0; index < data.items.length; index += 1) {
    const item = data.items[index]
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) files.push(file)
    }
  }
  return files
}

type ImageUploaderProps = {
  images: ImageUpload[]
  principalId: string | undefined
  onAddFiles: (files: FileList | File[]) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onSetPrincipal: (id: string) => void
}

export function ImageUploader({
  images,
  principalId,
  onAddFiles,
  onRetry,
  onRemove,
  onSetPrincipal,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  // Colar imagem (Ctrl+V) em qualquer lugar do form enquanto ele está aberto.
  // Ref pra não re-assinar o listener a cada render (onAddFiles não é memoizado);
  // atualizada num effect (mexer em ref durante o render é proibido).
  const onAddFilesRef = useRef(onAddFiles)
  useEffect(() => {
    onAddFilesRef.current = onAddFiles
  }, [onAddFiles])
  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const files = imageFilesFromClipboard(event.clipboardData)
      if (files.length > 0) {
        event.preventDefault()
        onAddFilesRef.current(files)
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files.length > 0) onAddFiles(event.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-taupe">
        Fotos (opcional)
      </span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex h-24 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed text-sm text-taupe transition-colors',
          dragging ? 'border-moss bg-moss/5' : 'border-line bg-paper',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-moss" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <span>
          Arraste, cole (Ctrl+V) ou{' '}
          <span className="font-semibold text-moss">toque pra selecionar</span>
        </span>
      </button>

      <input
        ref={inputRef}
        id="fotos-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) onAddFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((item) => (
            <ImageThumb
              key={item.id}
              item={item}
              isPrincipal={item.id === principalId}
              onRetry={onRetry}
              onRemove={onRemove}
              onSetPrincipal={onSetPrincipal}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
