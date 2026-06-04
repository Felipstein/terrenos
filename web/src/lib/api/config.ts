// Base URL do backend (contract/openapi.yaml). Definida em VITE_API_URL.
// Trailing slash removida pra montar paths sem barra dupla.
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export function apiUrl(path: string): string {
  return `${API_URL}${path}`
}
