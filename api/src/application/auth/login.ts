import type { AuthProvider, AuthResult } from '../ports/auth-provider'

/** Autentica e devolve a sessão (tokens + usuário). */
export class Login {
  constructor(private readonly auth: AuthProvider) {}

  execute(email: string, password: string): Promise<AuthResult> {
    return this.auth.login(email, password)
  }
}
