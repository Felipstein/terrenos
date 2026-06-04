import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccountId } from '../../http/claims'
import { parseBody } from '../../http/validate'
import { uploadSchema } from '../../schemas/upload.schema'
import { CreateImageUpload } from '../../application/uploads/create-image-upload'
import { S3ImageStorage } from '../../infra/s3/image-storage.s3'
import { s3Client } from '../../infra/s3/client'
import { env } from '../../config/env'

const useCase = new CreateImageUpload(
  new S3ImageStorage(s3Client, env.imagesBucket, env.publicAssetBaseUrl),
)

/** `POST /uploads` — protegida. Devolve um alvo de presigned POST + a imagem final. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const accountId = getAccountId(event)
  const { contentType } = parseBody(event, uploadSchema)
  const target = await useCase.execute(accountId, contentType)
  return ok(target)
})
