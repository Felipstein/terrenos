import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Terreno } from '../types/terreno'
import { createHttpTerrenoService } from './terreno-service'
import { memoryStorage } from '../test/memory-storage'

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const input = {
  rua: 'Rua X, 1',
  preco: 100000,
  lat: -22.9,
  lng: -47.0,
  areaTotal: 200,
}

const sample: Terreno = { id: 'a1', ...input }

describe('createHttpTerrenoService', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('localStorage', memoryStorage()) // sem sessão → sem header de auth
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('list faz GET em /terrenos', async () => {
    fetchMock.mockResolvedValue(jsonResponse([sample]))
    const list = await createHttpTerrenoService().list()
    expect(list).toEqual([sample])
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url).endsWith('/terrenos')).toBe(true)
    expect(init.method).toBe('GET')
  })

  it('create faz POST com o input no corpo', async () => {
    fetchMock.mockResolvedValue(jsonResponse(sample, 201))
    const created = await createHttpTerrenoService().create(input)
    expect(created).toEqual(sample)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url).endsWith('/terrenos')).toBe(true)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual(input)
  })

  it('update faz PUT em /terrenos/{id} sem o id no corpo', async () => {
    fetchMock.mockResolvedValue(jsonResponse(sample))
    await createHttpTerrenoService().update(sample)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url).endsWith('/terrenos/a1')).toBe(true)
    expect(init.method).toBe('PUT')
    expect(JSON.parse(init.body).id).toBeUndefined()
  })

  it('remove faz DELETE e aceita 204 sem corpo', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    await expect(createHttpTerrenoService().remove('a1')).resolves.toBeUndefined()
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url).endsWith('/terrenos/a1')).toBe(true)
    expect(init.method).toBe('DELETE')
  })

  it('propaga erro com a mensagem do corpo', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Não encontrado' }, 404))
    await expect(createHttpTerrenoService().remove('x')).rejects.toThrow('Não encontrado')
  })
})
