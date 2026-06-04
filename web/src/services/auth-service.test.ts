import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHttpAuthService } from './auth-service'
import { readSession, writeSession, type Session } from './session-store'
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

  it('login deriva expiresAt de expiresIn e persiste a sessão', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ accessToken: 'a', refreshToken: 'r', expiresIn: 3600, user: { username: 'felipe' } }),
    )
    const before = Date.now()
    const session = await createHttpAuthService().login('felipe', 'segredo')

    expect(session.user.username).toBe('felipe')
    expect(session.accessToken).toBe('a')
    expect(session.expiresAt).toBeGreaterThanOrEqual(before + 3600 * 1000)
    expect(readSession()?.accessToken).toBe('a')
  })

  it('login propaga erro 401 com a mensagem do corpo', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Credenciais inválidas' }, 401))
    await expect(createHttpAuthService().login('felipe', 'errada')).rejects.toThrow(
      'Credenciais inválidas',
    )
  })

  it('getSession retorna null quando não há sessão', async () => {
    expect(await createHttpAuthService().getSession()).toBeNull()
  })

  it('getSession renova o access token quando expirou', async () => {
    const expired: Session = {
      user: { username: 'felipe' },
      accessToken: 'velho',
      refreshToken: 'r',
      expiresAt: Date.now() - 1000,
    }
    writeSession(expired)
    fetchMock.mockResolvedValue(jsonResponse({ accessToken: 'novo', expiresIn: 3600 }))

    const session = await createHttpAuthService().getSession()
    expect(session?.accessToken).toBe('novo')
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('logout encerra a sessão', async () => {
    writeSession({
      user: { username: 'felipe' },
      accessToken: 'a',
      refreshToken: 'r',
      expiresAt: Date.now() + 10000,
    })
    await createHttpAuthService().logout()
    expect(readSession()).toBeNull()
  })
})
