import { describe, expect, it } from 'vitest'
import { buildDirectionsUrl } from './maps'

describe('buildDirectionsUrl', () => {
  it('monta a URL de direções do Google Maps com lat,lng', () => {
    expect(buildDirectionsUrl(-22.9056, -47.0608)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-22.9056,-47.0608',
    )
  })
})
