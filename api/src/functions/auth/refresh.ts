import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { parseBody } from '../../http/validate'
import { refreshSchema } from '../../schemas/auth.schema'
import { RefreshToken } from '../../application/auth/refresh-token'
import { CognitoAuthProvider } from '../../infra/cognito/auth-provider.cognito'
import { cognitoClient } from '../../infra/cognito/client'
import { env } from '../../config/env'

const useCase = new RefreshToken(new CognitoAuthProvider(cognitoClient, env.cognitoClientId))

/** `POST /auth/refresh` — pública. Devolve `AuthTokens` (access + refresh rotativo). */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2) => {
  const { refreshToken } = parseBody(event, refreshSchema)
  const result = await useCase.execute(refreshToken)
  return ok({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  })
})
