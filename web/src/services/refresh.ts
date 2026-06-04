import type { components } from '../types/api'
import { apiUrl } from '../lib/api/config'
import { clearSession, readSession, writeSession } from './session-store'

type AuthTokens = components['schemas']['AuthTokens']

// Renova o accessToken via POST /auth/refresh. Faz um fetch cru (não passa pelo
// http-client) pra não recursar no interceptor de 401. Em caso de falha, encerra
// a sessão local. Retorna o novo accessToken, ou null se não deu pra renovar.
//
// Memoiza a chamada em voo: vários 401 simultâneos compartilham um único refresh.
let inFlight: Promise<string | null> | null = null

export function refreshSession(): Promise<string | null> {
  inFlight ??= run().finally(() => {
    inFlight = null
  })
  return inFlight
}

async function run(): Promise<string | null> {
  const session = readSession()
  if (!session?.refreshToken) return null

  let response: Response
  try {
    response = await fetch(apiUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
  } catch {
    return null // rede caiu: mantém a sessão pra tentar de novo depois
  }

  if (!response.ok) {
    clearSession()
    return null
  }

  const tokens = (await response.json()) as AuthTokens
  writeSession({
    ...session,
    accessToken: tokens.accessToken,
    expiresAt: Date.now() + tokens.expiresIn * 1000,
  })
  return tokens.accessToken
}
