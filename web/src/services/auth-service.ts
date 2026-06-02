// Auth básico local (temporário). Toda a "sujeira" (token fake, localStorage)
// fica escondida atrás do AuthService. Quando o backend existir, troca-se a
// implementação por uma HTTP sem mexer na UI. Ver skill `frontend-conventions`.
//
// AVISO: isto NÃO é seguro de verdade (credencial vai no bundle). É só um portão
// pra não deixar o app aberto. Auth real (refresh token de verdade) vem com o backend.

export type AuthUser = { username: string }

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

export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

type Credentials = { username: string; password: string }

const STORAGE_KEY = 'auth:v1'
const ACCESS_TTL_MS = 60 * 60 * 1000 // 1h

function fakeToken(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}

export function createLocalAuthService(
  credentials: Credentials,
  store: KeyValueStore = localStorage,
): AuthService {
  function read(): Session | null {
    const raw = store.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as Session
    } catch {
      return null
    }
  }

  function write(session: Session): void {
    store.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  function issue(username: string): Session {
    return {
      user: { username },
      accessToken: fakeToken('access'),
      refreshToken: fakeToken('refresh'),
      expiresAt: Date.now() + ACCESS_TTL_MS,
    }
  }

  return {
    async login(username, password) {
      const ok = username === credentials.username && password === credentials.password
      if (!ok) throw new Error('Usuário ou senha inválidos')
      const session = issue(username)
      write(session)
      return session
    },

    async getSession() {
      const session = read()
      if (!session) return null
      if (Date.now() < session.expiresAt) return session
      // "refresh" local: renova o access token usando o refresh token (fake).
      if (session.refreshToken) {
        const refreshed: Session = {
          ...session,
          accessToken: fakeToken('access'),
          expiresAt: Date.now() + ACCESS_TTL_MS,
        }
        write(refreshed)
        return refreshed
      }
      return null
    },

    async logout() {
      store.removeItem(STORAGE_KEY)
    },
  }
}

let instance: AuthService | null = null

export function getAuthService(): AuthService {
  if (instance === null) {
    instance = createLocalAuthService({
      username: import.meta.env.VITE_APP_USERNAME ?? 'admin',
      password: import.meta.env.VITE_APP_PASSWORD ?? 'admin',
    })
  }
  return instance
}
