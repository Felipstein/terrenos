import { randomUUID } from 'node:crypto'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import type { S3Client } from '@aws-sdk/client-s3'
import type { ImageStorage, ImageUpload } from '../../application/ports/image-storage'
import { BadRequestError } from '../../domain/errors'

/** Content-types aceitos → extensão do objeto. */
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB
const URL_EXPIRES_SECONDS = 300

/**
 * ImageStorage sobre S3 via presigned POST. As `Conditions` travam o que o
 * cliente pode enviar (tamanho e content-type); a `Key` é fixa. O objeto fica
 * em `images/<accountId>/<id>.<ext>` e é servido pela URL pública do bucket.
 */
export class S3ImageStorage implements ImageStorage {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string,
    private readonly publicBaseUrl: string,
  ) {}

  async createUpload(accountId: string, contentType: string): Promise<ImageUpload> {
    const extension = ALLOWED_CONTENT_TYPES[contentType]
    if (extension === undefined) {
      throw new BadRequestError('Tipo de imagem não suportado')
    }

    const id = randomUUID()
    const key = `images/${accountId}/${id}.${extension}`

    const presigned = await createPresignedPost(this.client, {
      Bucket: this.bucket,
      Key: key,
      Expires: URL_EXPIRES_SECONDS,
      Conditions: [['content-length-range', 1, MAX_UPLOAD_BYTES], { 'Content-Type': contentType }],
      Fields: { 'Content-Type': contentType },
    })

    return {
      upload: { url: presigned.url, fields: presigned.fields },
      image: { id, url: `${this.publicBaseUrl}/${key}` },
    }
  }
}
