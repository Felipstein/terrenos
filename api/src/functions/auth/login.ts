import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { makeHandler } from '../../http/makeHandler'
import { ok } from '../../http/response'
import { parseBody } from '../../http/validate'
import { loginSchema } from '../../schemas/auth.schema'
import { Login } from '../../application/auth/login'
import { CognitoAuthProvider } from '../../infra/cognito/auth-provider.cognito'
import { cognitoClient } from '../../infra/cognito/client'
import { env } from '../../config/env'

const useCase = new Login(new CognitoAuthProvider(cognitoClient, env.cognitoClientId))

/** `POST /auth/login` — pública. Devolve `AuthSession` (tokens + usuário). */
export const handler = makeHandler(async (event: APIGatewayProxyEventV2) => {
  const { username, password } = parseBody(event, loginSchema)
  const result = await useCase.execute(username, password)
  return ok({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
    user: { username: result.username },
  })
})
