import { beforeEach, describe, expect, it } from 'vitest'
import { createLocalAuthService, type KeyValueStore } from './auth-service'

function memoryStore(): KeyValueStore {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

const creds = { username: 'felipe', password: 'segredo' }

describe('createLocalAuthService', () => {
  let store: KeyValueStore

  beforeEach(() => {
    store = memoryStore()
  })

  it('loga com credencial correta e cria sessão', async () => {
    const auth = createLocalAuthService(creds, store)
    const session = await auth.login('felipe', 'segredo')
    expect(session.user.username).toBe('felipe')
    expect(session.accessToken).toBeTruthy()
    expect(session.refreshToken).toBeTruthy()
  })

  it('rejeita credencial errada', async () => {
    const auth = createLocalAuthService(creds, store)
    await expect(auth.login('felipe', 'errado')).rejects.toThrow()
  })

  it('getSession retorna a sessão após login', async () => {
    const auth = createLocalAuthService(creds, store)
    await auth.login('felipe', 'segredo')
    expect(await auth.getSession()).not.toBeNull()
  })

  it('logout encerra a sessão', async () => {
    const auth = createLocalAuthService(creds, store)
    await auth.login('felipe', 'segredo')
    await auth.logout()
    expect(await auth.getSession()).toBeNull()
  })
})
