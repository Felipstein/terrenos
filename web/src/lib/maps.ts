// Deep-link pro Google Maps nativo com a rota até o destino.
// Independe da lib de mapa usada na tela (skill map-deeplinks).
export function buildDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
