import type { components } from '../types/api'
import { apiUrl } from '../lib/api/config'
import { clearTokens, readTokens, writeTokens } from './session-store'

type AuthTokens = components['schemas']['AuthTokens']

// Renova o accessToken via POST /auth/refresh. Faz um fetch cru (não passa pelo
// http-client) pra não recursar no interceptor de 401. Em caso de falha, encerra
// a sessão local. Retorna o novo accessToken, ou null se não deu pra renovar.
//
// O backend usa refresh token rotation (grace period 0): cada chamada devolve um
// refresh token NOVO e invalida o anterior — por isso persistimos os dois tokens.
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
  const tokens = readTokens()
  if (!tokens?.refreshToken) return null

  let response: Response
  try {
    response = await fetch(apiUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })
  } catch {
    return null // rede caiu: mantém a sessão pra tentar de novo depois
  }

  if (!response.ok) {
    clearTokens()
    return null
  }

  const next = (await response.json()) as AuthTokens
  writeTokens({
    accessToken: next.accessToken,
    refreshToken: next.refreshToken,
    expiresAt: Date.now() + next.expiresIn * 1000,
  })
  return next.accessToken
}
