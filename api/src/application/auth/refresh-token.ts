import type { AuthProvider, RefreshResult } from '../ports/auth-provider'

/** Renova o access token. Com rotation, devolve também um novo refresh token. */
export class RefreshToken {
  constructor(private readonly auth: AuthProvider) {}

  execute(refreshToken: string): Promise<RefreshResult> {
    return this.auth.refresh(refreshToken)
  }
}
