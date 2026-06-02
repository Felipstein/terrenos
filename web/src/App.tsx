import { APIProvider } from '@vis.gl/react-google-maps'
import { useAuth } from './hooks/useAuth'
import { AuthGate } from './features/auth/AuthGate'
import { AppShell } from './features/shell/AppShell'
import { GOOGLE_MAPS_API_KEY } from './features/map/config'

export function App() {
  const auth = useAuth()

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <AuthGate auth={auth}>
        <AppShell onLogout={auth.logout} />
      </AuthGate>
    </APIProvider>
  )
}
