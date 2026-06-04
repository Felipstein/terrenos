// Persistência dos tokens da sessão (localStorage). Camada burra: só lê/escreve/
// limpa. A identidade do usuário NÃO mora aqui — vem do GET /me (ver auth-service).
// O http-client lê o accessToken daqui pra mandar no header Authorization.

export type StoredTokens = {
  accessToken: string
  refreshToken: string
  expiresAt: number // epoch ms em que o accessToken expira
}

// v3: a sessão persistida passou a ser só tokens (sem `user`, que agora vem do
// /me). Invalida sessões 'auth:v2' que carregavam o blob de usuário.
const STORAGE_KEY = 'auth:v3'

export function readTokens(): StoredTokens | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredTokens
  } catch {
    return null
  }
}

export function writeTokens(tokens: StoredTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEY)
}
