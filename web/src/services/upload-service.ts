import type { TerrenoImagem } from '../types/terreno'
import { genId } from '../lib/id'

// Upload escondido atrás de um service (skill frontend-conventions). Hoje é um
// MOCK: lê o arquivo como data URL, simula progresso e resolve. Quando houver
// backend, troca-se por um upload HTTP real (que retorna a URL remota) sem
// mexer na UI.
export interface UploadService {
  upload(file: File, onProgress: (percent: number) => void): Promise<TerrenoImagem>
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    reader.readAsDataURL(file)
  })
}

export function createMockUploadService(): UploadService {
  return {
    async upload(file, onProgress) {
      const url = await readAsDataUrl(file)
      await new Promise<void>((resolve, reject) => {
        let percent = 0
        const timer = setInterval(() => {
          percent = Math.min(100, percent + 12 + Math.round(Math.random() * 12))
          onProgress(percent)
          if (percent >= 100) {
            clearInterval(timer)
            // Falha determinística pra testar o estado de erro: nome com "fail".
            if (/fail/i.test(file.name)) reject(new Error('Falha no upload'))
            else resolve()
          }
        }, 130)
      })
      return { id: genId(), url }
    },
  }
}

let instance: UploadService | null = null

export function getUploadService(): UploadService {
  if (instance === null) instance = createMockUploadService()
  return instance
}
