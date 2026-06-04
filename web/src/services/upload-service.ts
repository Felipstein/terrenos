import type { TerrenoImagem } from '../types/terreno'
import { apiUrl } from '../lib/api/config'
import { ApiError } from '../lib/api/errors'
import { readSession } from './session-store'

// Upload de imagem via POST /uploads (multipart). Usa XMLHttpRequest porque o
// fetch não reporta progresso de upload — e o form mostra a barra de progresso.
// Retorna { id, url } (a URL remota salva pelo backend).
export interface UploadService {
  upload(file: File, onProgress: (percent: number) => void): Promise<TerrenoImagem>
}

export function createHttpUploadService(): UploadService {
  return {
    upload(file, onProgress) {
      return new Promise<TerrenoImagem>((resolve, reject) => {
        const form = new FormData()
        form.append('file', file)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', apiUrl('/uploads'))

        const token = readSession()?.accessToken
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100))
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText) as TerrenoImagem)
            } catch {
              reject(new ApiError(xhr.status, 'Resposta inválida do upload'))
            }
            return
          }
          reject(new ApiError(xhr.status, errorMessage(xhr.responseText)))
        }

        xhr.onerror = () => reject(new ApiError(0, 'Falha de rede no upload'))
        xhr.send(form)
      })
    },
  }
}

function errorMessage(responseText: string): string {
  try {
    const data = JSON.parse(responseText) as { message?: string }
    if (data?.message) return data.message
  } catch {
    // sem corpo JSON
  }
  return 'Falha no upload'
}

let instance: UploadService | null = null

export function getUploadService(): UploadService {
  if (instance === null) instance = createHttpUploadService()
  return instance
}
