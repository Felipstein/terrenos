import { useCallback } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

// Reverse geocoding via Google (endereço a partir de lat/lng). Retorna null se a
// lib ainda não carregou (ex: sem chave). Governado pela skill `map-deeplinks`.
export function useReverseGeocode(): (lat: number, lng: number) => Promise<string | null> {
  const geocodingLib = useMapsLibrary('geocoding')

  return useCallback(
    async (lat, lng) => {
      if (!geocodingLib) return null
      try {
        const geocoder = new geocodingLib.Geocoder()
        const { results } = await geocoder.geocode({ location: { lat, lng } })
        return results[0]?.formatted_address ?? null
      } catch {
        return null
      }
    },
    [geocodingLib],
  )
}
