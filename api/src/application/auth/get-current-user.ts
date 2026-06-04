import type { AuthProvider } from '../ports/auth-provider'

/** Resolve o usuário autenticado a partir do access token (rota `GET /me`). */
export class GetCurrentUser {
  constructor(private readonly auth: AuthProvider) {}

  execute(accessToken: string): Promise<{ username: string }> {
    return this.auth.getUser(accessToken)
  }
}
