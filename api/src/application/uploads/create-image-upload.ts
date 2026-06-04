import type { ImageStorage, ImageUpload } from '../ports/image-storage'

/** Gera um alvo de upload presigned POST pra uma imagem da conta. */
export class CreateImageUpload {
  constructor(private readonly storage: ImageStorage) {}

  execute(accountId: string, contentType: string): Promise<ImageUpload> {
    return this.storage.createUpload(accountId, contentType)
  }
}
