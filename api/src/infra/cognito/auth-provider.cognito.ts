import {
  GetUserCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
  type CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import type { AuthProvider, AuthResult, RefreshResult } from '../../application/ports/auth-provider'
import { UnauthorizedError } from '../../domain/errors'

/**
 * AuthProvider sobre o Cognito.
 * - login: `USER_PASSWORD_AUTH` (pool com email como username).
 * - refresh: `REFRESH_TOKEN_AUTH` — com rotation habilitada, retorna um novo
 *   refresh token a cada chamada.
 * - getUser: `GetUser` autoriza pelo próprio access token (escopo
 *   `aws.cognito.signin.user.admin` que vem por padrão), sem IAM.
 *
 * Erros de credencial do Cognito viram `UnauthorizedError` (401); o resto sobe
 * e vira 500.
 */
export class CognitoAuthProvider implements AuthProvider {
  constructor(
    private readonly client: CognitoIdentityProviderClient,
    private readonly clientId: string,
  ) {}

  async login(email: string, password: string): Promise<AuthResult> {
    const response = await this.authorized(
      this.client.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.clientId,
          AuthParameters: { USERNAME: email, PASSWORD: password },
        }),
      ),
    )
    const authentication = response.AuthenticationResult
    if (!authentication?.AccessToken || !authentication.RefreshToken) {
      throw new UnauthorizedError('Credenciais inválidas')
    }
    return {
      accessToken: authentication.AccessToken,
      refreshToken: authentication.RefreshToken,
      expiresIn: authentication.ExpiresIn ?? 0,
      username: email,
    }
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    const response = await this.authorized(
      this.client.send(
        new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: this.clientId,
          AuthParameters: { REFRESH_TOKEN: refreshToken },
        }),
      ),
    )
    const authentication = response.AuthenticationResult
    if (!authentication?.AccessToken) {
      throw new UnauthorizedError('Refresh token inválido ou expirado')
    }
    return {
      accessToken: authentication.AccessToken,
      // Com rotation, o Cognito devolve um refresh novo; sem ele, reusa o atual.
      refreshToken: authentication.RefreshToken ?? refreshToken,
      expiresIn: authentication.ExpiresIn ?? 0,
    }
  }

  async getUser(accessToken: string): Promise<{ username: string }> {
    const response = await this.authorized(this.client.send(new GetUserCommand({ AccessToken: accessToken })))
    const email = response.UserAttributes?.find((attribute) => attribute.Name === 'email')?.Value
    const username = email ?? response.Username
    if (!username) {
      throw new UnauthorizedError('Não foi possível identificar o usuário')
    }
    return { username }
  }

  /** Converte erros de credencial do Cognito em `UnauthorizedError` (401). */
  private async authorized<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise
    } catch (error) {
      if (
        error instanceof NotAuthorizedException ||
        error instanceof UserNotFoundException ||
        error instanceof UserNotConfirmedException
      ) {
        throw new UnauthorizedError('Credenciais inválidas')
      }
      throw error
    }
  }
}
