import type { ReactNode } from 'react'
import type { UseAuth } from '../../hooks/useAuth'
import { LoginScreen } from './LoginScreen'

type AuthGateProps = {
  auth: UseAuth
  children: ReactNode
}

export function AuthGate({ auth, children }: AuthGateProps) {
  if (auth.loading) {
    return <div className="grid h-full place-items-center text-sm text-zinc-400">Carregando…</div>
  }
  if (!auth.session) {
    return <LoginScreen onLogin={auth.login} />
  }
  return <>{children}</>
}
