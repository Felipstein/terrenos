import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { getAccessToken } from '../../http/claims'
import { GetCurrentUser } from '../../application/auth/get-current-user'
import { CognitoAuthProvider } from '../../infra/cognito/auth-provider.cognito'
import { cognitoClient } from '../../infra/cognito/client'
import { env } from '../../config/env'

const useCase = new GetCurrentUser(new CognitoAuthProvider(cognitoClient, env.cognitoClientId))

/** `GET /me` — protegida. Devolve `AuthUser` a partir do access token. */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const user = await useCase.execute(getAccessToken(event))
  return ok(user)
})
