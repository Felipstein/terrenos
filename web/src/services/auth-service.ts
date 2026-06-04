// Auth via backend (contract/openapi.yaml): /auth/login, /auth/refresh e /me.
// O localStorage guarda só os tokens (session-store); a identidade do usuário é a
// fonte da verdade do servidor, lida via GET /me. A UI conhece só o AuthService.

import type { components } from '../types/api'
import { request } from '../lib/api/http'
import {
  clearTokens,
  readTokens,
  writeTokens,
} from './session-store'
import { refreshSession } from './refresh'

type AuthSession = components['schemas']['AuthSession']

export type AuthUser = components['schemas']['AuthUser']

// Sessão como a UI enxerga: identidade (vinda do login/me) + tokens em vigor.
export type Session = {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthService {
  getSession(): Promise<Session | null>
  login(username: string, password: string): Promise<Session>
  logout(): Promise<void>
}

export function createHttpAuthService(): AuthService {
  return {
    async login(username, password) {
      const auth = await request<AuthSession>('/auth/login', {
        method: 'POST',
        auth: false,
        body: { username, password },
      })
      writeTokens({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        expiresAt: Date.now() + auth.expiresIn * 1000,
      })
      return {
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        expiresAt: Date.now() + auth.expiresIn * 1000,
      }
    },

    async getSession() {
      let tokens = readTokens()
      if (!tokens) return null

      // Garante um access token válido: se expirou, renova (rotacionando o
      // refresh). Falhou o refresh → sem sessão.
      if (Date.now() >= tokens.expiresAt) {
        const renewed = await refreshSession()
        if (!renewed) return null
        tokens = readTokens()
        if (!tokens) return null
      }

      // Identidade é a fonte da verdade do servidor: o request injeta o Bearer e,
      // em 401, tenta renovar uma vez. Se mesmo assim falhar, não há sessão.
      let user: AuthUser
      try {
        user = await request<AuthUser>('/me')
      } catch {
        return null
      }

      // Reler tokens: o /me pode ter disparado um refresh interno (rotation) e
      // rotacionado os tokens enquanto resolvia o 401.
      const current = readTokens()
      if (!current) return null
      return {
        user,
        accessToken: current.accessToken,
        refreshToken: current.refreshToken,
        expiresAt: current.expiresAt,
      }
    },

    async logout() {
      // Sem endpoint de logout no contrato: encerra a sessão localmente.
      clearTokens()
    },
  }
}

let instance: AuthService | null = null

export function getAuthService(): AuthService {
  if (instance === null) instance = createHttpAuthService()
  return instance
}
