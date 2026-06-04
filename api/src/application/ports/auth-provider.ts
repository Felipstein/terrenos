/** Resultado de um login: tokens + identidade. */
export type AuthResult = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  username: string
}

/** Resultado de um refresh: novos tokens (refresh token rotativo). */
export type RefreshResult = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Provedor de autenticação. Implementado sobre o Cognito em `infra/`. Abstrai
 * login, refresh (rotativo) e a leitura do usuário a partir do access token.
 */
export interface AuthProvider {
  login(email: string, password: string): Promise<AuthResult>
  refresh(refreshToken: string): Promise<RefreshResult>
  getUser(accessToken: string): Promise<{ username: string }>
}
