import { beforeEach, describe, expect, it, vi } from 'vitest'

const createPresignedPost = vi.fn()
vi.mock('@aws-sdk/s3-presigned-post', () => ({ createPresignedPost }))

const { S3ImageStorage } = await import('../../src/infra/s3/image-storage.s3')
const { BadRequestError } = await import('../../src/domain/errors')
import type { S3Client } from '@aws-sdk/client-s3'

const fakeClient = {} as S3Client
const storage = new S3ImageStorage(fakeClient, 'my-bucket', 'https://cdn.example.com')

beforeEach(() => {
  createPresignedPost.mockReset()
  createPresignedPost.mockResolvedValue({
    url: 'https://my-bucket.s3.amazonaws.com',
    fields: { key: 'set-by-aws' },
  })
})

describe('S3ImageStorage', () => {
  it('rejeita content-type não suportado', async () => {
    await expect(storage.createUpload('acct-1', 'application/pdf')).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('assina com key no prefixo da conta, extensão certa e limites', async () => {
    const result = await storage.createUpload('acct-1', 'image/png')

    const call = createPresignedPost.mock.calls.at(0)
    if (!call) throw new Error('createPresignedPost não foi chamado')
    const args = call[1] as { Bucket: string; Key: string; Conditions: unknown[] }
    expect(args.Bucket).toBe('my-bucket')
    expect(args.Key).toMatch(/^images\/acct-1\/[0-9a-f-]+\.png$/)
    expect(args.Conditions).toContainEqual(['content-length-range', 1, 5 * 1024 * 1024])
    expect(args.Conditions).toContainEqual({ 'Content-Type': 'image/png' })

    // image.url é a URL pública final (base + key), e o id bate com a key.
    expect(result.image.url).toBe(`https://cdn.example.com/${args.Key}`)
    expect(args.Key).toContain(result.image.id)
  })
})
