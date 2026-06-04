import { S3Client } from '@aws-sdk/client-s3'

/** Cliente S3 compartilhado. Usado só pra assinar o presigned POST. */
export const s3Client = new S3Client({})
