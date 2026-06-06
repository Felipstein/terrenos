import { useRef, useState } from 'react'
import type { TerrenoImagem } from '../../types/terreno'
import type { ImageUpload } from '../../components/ImageUploader/types'
import { genId } from '../../lib/id'
import { getUploadService } from '../../services/upload-service'

export type UseImageUploads = {
  images: ImageUpload[]
  principalId: string | undefined
  uploading: boolean
  dirty: boolean
  addFiles: (files: FileList | File[]) => void
  retry: (id: string) => void
  remove: (id: string) => void
  setPrincipal: (id: string) => void
  getResult: () => { imagens: TerrenoImagem[]; principalId: string | undefined }
}

export function useImageUploads(
  initial: TerrenoImagem[] = [],
  initialPrincipal?: string,
): UseImageUploads {
  const [images, setImages] = useState<ImageUpload[]>(() =>
    initial.map((img) => ({
      id: img.id,
      name: '',
      previewUrl: img.url,
      status: 'done' as const,
      progress: 100,
      url: img.url,
    })),
  )
  const [principalId, setPrincipalId] = useState<string | undefined>(
    initialPrincipal ?? initial[0]?.id,
  )
  const filesRef = useRef(new Map<string, File>())
  // Alterações em imagens não passam pelo react-hook-form, então marcamos à mão
  // pra o guard de "descartar alterações" detectar mexidas na galeria.
  const [dirty, setDirty] = useState(false)

  function patch(id: string, value: Partial<ImageUpload>) {
    setImages((prev) => prev.map((item) => (item.id === id ? { ...item, ...value } : item)))
  }

  async function run(id: string, file: File) {
    try {
      const result = await getUploadService().upload(file, (percent) => patch(id, { progress: percent }))
      patch(id, { status: 'done', progress: 100, url: result.url })
      setPrincipalId((current) => current ?? id)
    } catch {
      patch(id, { status: 'error' })
    }
  }

  function addFiles(files: FileList | File[]) {
    if (files.length > 0) setDirty(true)
    for (const file of Array.from(files)) {
      const id = genId()
      filesRef.current.set(id, file)
      const item: ImageUpload = {
        id,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        status: 'uploading',
        progress: 0,
      }
      setImages((prev) => [...prev, item])
      void run(id, file)
    }
  }

  function retry(id: string) {
    const file = filesRef.current.get(id)
    if (!file) return
    patch(id, { status: 'uploading', progress: 0 })
    void run(id, file)
  }

  function remove(id: string) {
    setDirty(true)
    setImages((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target && target.previewUrl.startsWith('blob:')) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((item) => item.id !== id)
    })
    filesRef.current.delete(id)
    setPrincipalId((current) => (current === id ? undefined : current))
  }

  function setPrincipal(id: string) {
    setDirty(true)
    setPrincipalId(id)
  }

  function getResult() {
    const done = images.filter((item) => item.status === 'done' && item.url)
    const imagens: TerrenoImagem[] = done.map((item) => ({ id: item.id, url: item.url as string }))
    const principal =
      principalId && done.some((item) => item.id === principalId) ? principalId : done[0]?.id
    return { imagens, principalId: principal }
  }

  return {
    images,
    principalId,
    uploading: images.some((item) => item.status === 'uploading'),
    dirty,
    addFiles,
    retry,
    remove,
    setPrincipal,
    getResult,
  }
}
