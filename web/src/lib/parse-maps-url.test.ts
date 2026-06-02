import { describe, expect, it } from 'vitest'
import { parseLatLngFromGoogleMapsUrl } from './parse-maps-url'

describe('parseLatLngFromGoogleMapsUrl', () => {
  it('lê o formato @lat,lng,zoom', () => {
    const r = parseLatLngFromGoogleMapsUrl('https://www.google.com/maps/@-22.9056,-47.0608,17z')
    expect(r).toEqual({ lat: -22.9056, lng: -47.0608 })
  })

  it('lê o formato de place !3d!4d', () => {
    const r = parseLatLngFromGoogleMapsUrl(
      'https://www.google.com/maps/place/X/data=!3d-22.91!4d-47.06',
    )
    expect(r).toEqual({ lat: -22.91, lng: -47.06 })
  })

  it('lê o formato q=lat,lng', () => {
    const r = parseLatLngFromGoogleMapsUrl('https://maps.google.com/?q=-22.9,-47.0')
    expect(r).toEqual({ lat: -22.9, lng: -47.0 })
  })

  it('retorna null quando não encontra coordenadas', () => {
    expect(parseLatLngFromGoogleMapsUrl('https://maps.app.goo.gl/abc123')).toBeNull()
  })
})
