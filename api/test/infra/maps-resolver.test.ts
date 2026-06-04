import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpMapsResolver } from '../../src/infra/maps/maps-resolver.http'
import { ValidationError } from '../../src/domain/errors'

const resolver = new HttpMapsResolver()

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HttpMapsResolver (link completo, sem rede)', () => {
  it('extrai do formato @lat,lng', async () => {
    const location = await resolver.resolve(
      'https://www.google.com/maps/@-22.9056,-47.0608,17z',
    )
    expect(location).toEqual({ lat: -22.9056, lng: -47.0608 })
  })

  it('extrai do formato !3dlat!4dlng', async () => {
    const location = await resolver.resolve(
      'https://www.google.com/maps/place/X/data=!3d-23.5!4d-46.6',
    )
    expect(location).toEqual({ lat: -23.5, lng: -46.6 })
  })

  it('extrai de q=lat,lng', async () => {
    const location = await resolver.resolve('https://maps.google.com/?q=-10.1,-20.2')
    expect(location).toEqual({ lat: -10.1, lng: -20.2 })
  })

  it('extrai do formato /maps/search/lat,+lng (pra onde o link curto resolve)', async () => {
    const location = await resolver.resolve(
      'https://www.google.com/maps/search/-24.410989,+-53.534302?entry=tts',
    )
    expect(location).toEqual({ lat: -24.410989, lng: -53.534302 })
  })
})

describe('HttpMapsResolver (link curto, segue redirect)', () => {
  it('segue o redirect e extrai da URL final', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ url: 'https://www.google.com/maps/@-1.5,-2.5,17z' }) as Response),
    )
    const location = await resolver.resolve('https://maps.app.goo.gl/abc123')
    expect(location).toEqual({ lat: -1.5, lng: -2.5 })
  })

  it('lança ValidationError quando não há coordenadas', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ url: 'https://example.com/nada' }) as Response))
    await expect(resolver.resolve('https://maps.app.goo.gl/zzz')).rejects.toBeInstanceOf(
      ValidationError,
    )
  })

  it('propaga o erro do fetch (vira 500 no handler) — retry fica no front', async () => {
    const failing = vi.fn(async () => {
      throw new TypeError('fetch failed')
    })
    vi.stubGlobal('fetch', failing)
    await expect(resolver.resolve('https://maps.app.goo.gl/zzz')).rejects.toThrow('fetch failed')
    expect(failing).toHaveBeenCalledTimes(1)
  })
})
