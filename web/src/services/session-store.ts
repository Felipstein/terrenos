// Persistência da sessão (localStorage). Camada burra: só lê/escreve/limpa.
// A lógica de auth (login, refresh) vive no auth-service; o http-client lê o
// token daqui pra mandar no header Authorization.

export type AuthUser = { username: string }

export type Session = {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: number // epoch ms em que o accessToken expira
}

// v2: invalida sessões do auth local antigo (tokens fake, incompatíveis com o
// backend real). Quem tinha 'auth:v1' cai pro login na primeira carga.
const STORAGE_KEY = 'auth:v2'

export function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function writeSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
