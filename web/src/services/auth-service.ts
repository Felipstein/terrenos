// Auth via backend (contract/openapi.yaml): /auth/login + /auth/refresh.
// Tokens ficam no localStorage (session-store). A UI conhece só o AuthService.

import type { components } from '../types/api'
import { request } from '../lib/api/http'
import {
  clearSession,
  readSession,
  writeSession,
  type Session,
} from './session-store'
import { refreshSession } from './refresh'

export type { Session, AuthUser } from './session-store'

type AuthSession = components['schemas']['AuthSession']

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
      const session: Session = {
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        expiresAt: Date.now() + auth.expiresIn * 1000,
      }
      writeSession(session)
      return session
    },

    async getSession() {
      const session = readSession()
      if (!session) return null
      if (Date.now() < session.expiresAt) return session
      // Access token expirou: tenta renovar com o refresh token.
      const token = await refreshSession()
      if (!token) return null
      return readSession()
    },

    async logout() {
      // Sem endpoint de logout no contrato: encerra a sessão localmente.
      clearSession()
    },
  }
}

let instance: AuthService | null = null

export function getAuthService(): AuthService {
  if (instance === null) instance = createHttpAuthService()
  return instance
}
