import { useEffect, useState } from 'react'
import { getAuthService, type Session } from '../services/auth-service'

export type UseAuth = {
  session: Session | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): UseAuth {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuthService()
      .getSession()
      .then((current) => {
        setSession(current)
        setLoading(false)
      })
  }, [])

  async function login(username: string, password: string): Promise<void> {
    setSession(await getAuthService().login(username, password))
  }

  async function logout(): Promise<void> {
    await getAuthService().logout()
    setSession(null)
  }

  return { session, loading, login, logout }
}
