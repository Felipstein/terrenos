import { apiUrl } from './config'
import { ApiError } from './errors'
import { clearTokens, readTokens } from '../../services/session-store'
import { refreshSession } from '../../services/refresh'

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean // default true; rotas públicas (login/refresh) passam false
  signal?: AbortSignal
}

// Cliente HTTP único do app. Injeta o Bearer token, e em 401 tenta renovar o
// token uma vez e refaz a requisição. Erros viram ApiError(status, message).
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const useAuth = options.auth !== false

  const send = (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {}
    if (options.body !== undefined) headers['Content-Type'] = 'application/json'
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(apiUrl(path), {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  }

  let response = await send(useAuth ? (readTokens()?.accessToken ?? null) : null)

  if (response.status === 401 && useAuth) {
    const token = await refreshSession()
    if (!token) {
      clearTokens()
      throw new ApiError(401, 'Sessão expirada')
    }
    response = await send(token)
  }

  if (response.status === 204) return undefined as T

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  return (await response.json()) as T
}

// Corpo de erro do contrato é `{ message }`; cai pro statusText se não vier JSON.
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string }
    if (data?.message) return data.message
  } catch {
    // sem corpo JSON
  }
  return response.statusText || 'Erro na requisição'
}
