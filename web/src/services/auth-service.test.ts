import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHttpAuthService } from './auth-service'
import { readTokens, writeTokens, type StoredTokens } from './session-store'
import { memoryStorage } from '../test/memory-storage'

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('createHttpAuthService', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('localStorage', memoryStorage())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('login persiste os tokens e devolve a sessão com o user da resposta', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ accessToken: 'a', refreshToken: 'r', expiresIn: 3600, user: { username: 'felipe' } }),
    )
    const before = Date.now()
    const session = await createHttpAuthService().login('felipe', 'segredo')

    expect(session.user.username).toBe('felipe')
    expect(session.accessToken).toBe('a')
    expect(session.refreshToken).toBe('r')
    expect(session.expiresAt).toBeGreaterThanOrEqual(before + 3600 * 1000)

    const stored = readTokens()
    expect(stored?.accessToken).toBe('a')
    expect(stored?.refreshToken).toBe('r')
  })

  it('login propaga erro 401 com a mensagem do corpo', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Credenciais inválidas' }, 401))
    await expect(createHttpAuthService().login('felipe', 'errada')).rejects.toThrow(
      'Credenciais inválidas',
    )
  })

  it('getSession retorna null quando não há tokens', async () => {
    expect(await createHttpAuthService().getSession()).toBeNull()
  })

  it('getSession busca o user no /me e devolve a sessão', async () => {
    writeTokens({ accessToken: 'a', refreshToken: 'r', expiresAt: Date.now() + 10000 })
    fetchMock.mockResolvedValue(jsonResponse({ username: 'felipe' }))

    const session = await createHttpAuthService().getSession()
    expect(session?.user.username).toBe('felipe')
    expect(session?.accessToken).toBe('a')
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toContain('/me')
  })

  it('getSession renova o access token expirado e persiste o refresh rotacionado', async () => {
    const expired: StoredTokens = {
      accessToken: 'velho',
      refreshToken: 'r-velho',
      expiresAt: Date.now() - 1000,
    }
    writeTokens(expired)

    // 1ª chamada: POST /auth/refresh devolve novos tokens (rotation).
    // 2ª chamada: GET /me devolve o user.
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ accessToken: 'a-novo', refreshToken: 'r-novo', expiresIn: 3600 }),
      )
      .mockResolvedValueOnce(jsonResponse({ username: 'felipe' }))

    const session = await createHttpAuthService().getSession()

    expect(session?.user.username).toBe('felipe')
    expect(session?.accessToken).toBe('a-novo')
    expect(session?.refreshToken).toBe('r-novo')

    const stored = readTokens()
    expect(stored?.accessToken).toBe('a-novo')
    expect(stored?.refreshToken).toBe('r-novo')

    expect(fetchMock.mock.calls[0][0]).toContain('/auth/refresh')
    expect(fetchMock.mock.calls[1][0]).toContain('/me')
  })

  it('getSession retorna null quando o refresh do token expirado falha', async () => {
    writeTokens({ accessToken: 'velho', refreshToken: 'r', expiresAt: Date.now() - 1000 })
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Refresh inválido' }, 401))

    expect(await createHttpAuthService().getSession()).toBeNull()
    expect(readTokens()).toBeNull()
  })

  it('logout encerra a sessão', async () => {
    writeTokens({ accessToken: 'a', refreshToken: 'r', expiresAt: Date.now() + 10000 })
    await createHttpAuthService().logout()
    expect(readTokens()).toBeNull()
  })
})
