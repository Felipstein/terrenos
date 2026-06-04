import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
} from 'aws-lambda'
import { UnauthorizedError } from '../domain/errors'

/**
 * `accountId` da requisição = `sub` do JWT validado pelo authorizer do Cognito.
 * Um usuário = uma conta = uma partição do single-table.
 */
export function getAccountId(event: APIGatewayProxyEventV2WithJWTAuthorizer): string {
  const sub = event.requestContext.authorizer.jwt.claims.sub
  if (typeof sub !== 'string' || sub === '') {
    throw new UnauthorizedError('Sessão inválida')
  }
  return sub
}

/** Access token cru do header `Authorization` (usado pelo `GET /me`). */
export function getAccessToken(event: APIGatewayProxyEventV2): string {
  const header = event.headers.authorization ?? event.headers.Authorization
  const token = header?.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    throw new UnauthorizedError('Token de acesso ausente')
  }
  return token
}
