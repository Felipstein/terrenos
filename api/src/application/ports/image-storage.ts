/**
 * Alvo de upload via presigned POST. O cliente faz um `multipart/form-data`
 * POST direto pro `upload.url` com os `upload.fields` + o arquivo, sem passar
 * pela API. `image` é o registro final que entra em `Terreno.imagens`.
 */
export type ImageUpload = {
  upload: {
    url: string
    fields: Record<string, string>
  }
  image: {
    id: string
    url: string
  }
}

/**
 * Storage de imagens. A implementação S3 (em `infra/`) assina um POST com
 * limites de tamanho e content-type; o Lambda nunca toca no objeto.
 */
export interface ImageStorage {
  createUpload(accountId: string, contentType: string): Promise<ImageUpload>
}
