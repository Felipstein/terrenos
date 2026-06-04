import type { components } from '../types/api'
import type { TerrenoImagem } from '../types/terreno'
import { ApiError } from '../lib/api/errors'
import { request } from '../lib/api/http'

// Upload de imagem em duas etapas (presigned POST — padrão de mercado):
//   1. POST /uploads { contentType } → backend assina um POST do S3 e devolve
//      { upload: { url, fields }, image: { id, url } }.
//   2. POST multipart direto pro S3 (upload.url) com os fields + o arquivo.
// O backend nunca recebe o binário. A interface pública (upload → { id, url })
// é a mesma de antes, então o form não muda. XHR pra reportar progresso.
type UploadTarget = components['schemas']['UploadTarget']

export interface UploadService {
  upload(file: File, onProgress: (percent: number) => void): Promise<TerrenoImagem>
}

export function createHttpUploadService(): UploadService {
  return {
    async upload(file, onProgress) {
      const target = await request<UploadTarget>('/uploads', {
        method: 'POST',
        body: { contentType: file.type },
      })
      await sendToStorage(target.upload, file, onProgress)
      return target.image
    },
  }
}

// POST do arquivo direto pro S3. O campo `file` precisa ir POR ÚLTIMO no form,
// depois de todos os `fields` do presigned POST. Sem header Authorization: a
// autorização está na própria assinatura do POST.
function sendToStorage(
  upload: UploadTarget['upload'],
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const form = new FormData()
    for (const [field, value] of Object.entries(upload.fields)) {
      form.append(field, value)
    }
    form.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', upload.url)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
        return
      }
      reject(new ApiError(xhr.status, 'Falha ao enviar a imagem'))
    }

    xhr.onerror = () => reject(new ApiError(0, 'Falha de rede no upload'))
    xhr.send(form)
  })
}

let instance: UploadService | null = null

export function getUploadService(): UploadService {
  if (instance === null) instance = createHttpUploadService()
  return instance
}
