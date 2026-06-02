export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'
export const DEFAULT_CENTER = { lat: -22.9056, lng: -47.0608 }
export const hasGoogleMaps = GOOGLE_MAPS_API_KEY.length > 0
