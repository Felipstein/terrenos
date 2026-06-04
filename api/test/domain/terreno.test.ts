import { describe, expect, it } from 'vitest'
import { applyTerrenoUpdate, makeTerreno, type TerrenoInput } from '../../src/domain/terreno/terreno'
import { ValidationError } from '../../src/domain/errors'

const baseInput: TerrenoInput = {
  rua: 'Rua das Palmeiras, 120',
  preco: 185000,
  lat: -22.9056,
  lng: -47.0608,
  areaTotal: 999, // valor "errado" de propósito
}

const params = { id: 'terreno-1', now: '2026-06-04T12:00:00.000Z' }

describe('makeTerreno', () => {
  it('deriva areaTotal de largura × comprimento quando ambas existem', () => {
    const terreno = makeTerreno({ ...baseInput, largura: 10, comprimento: 25 }, params)
    expect(terreno.areaTotal).toBe(250)
  })

  it('usa a areaTotal informada quando faltam as medidas', () => {
    const terreno = makeTerreno({ ...baseInput, areaTotal: 300 }, params)
    expect(terreno.areaTotal).toBe(300)
  })

  it('carimba id e timestamps', () => {
    const terreno = makeTerreno(baseInput, params)
    expect(terreno.id).toBe('terreno-1')
    expect(terreno.createdAt).toBe(params.now)
    expect(terreno.updatedAt).toBe(params.now)
  })

  it('rejeita principalId que não está nas imagens', () => {
    const input: TerrenoInput = {
      ...baseInput,
      imagens: [{ id: 'img-1', url: 'https://x/img-1.jpg' }],
      principalId: 'fantasma',
    }
    expect(() => makeTerreno(input, params)).toThrow(ValidationError)
  })

  it('aceita principalId presente nas imagens', () => {
    const input: TerrenoInput = {
      ...baseInput,
      imagens: [{ id: 'img-1', url: 'https://x/img-1.jpg' }],
      principalId: 'img-1',
    }
    expect(() => makeTerreno(input, params)).not.toThrow()
  })
})

describe('applyTerrenoUpdate', () => {
  it('preserva id/createdAt e atualiza updatedAt', () => {
    const existing = makeTerreno(baseInput, params)
    const updated = applyTerrenoUpdate(
      existing,
      { ...baseInput, preco: 200000 },
      '2026-07-01T00:00:00.000Z',
    )
    expect(updated.id).toBe(existing.id)
    expect(updated.createdAt).toBe(existing.createdAt)
    expect(updated.updatedAt).toBe('2026-07-01T00:00:00.000Z')
    expect(updated.preco).toBe(200000)
  })
})
