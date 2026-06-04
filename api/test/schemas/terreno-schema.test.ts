import { describe, expect, it } from 'vitest'
import { terrenoInputSchema } from '../../src/schemas/terreno.schema'

const valid = {
  rua: 'Rua A',
  preco: 100000,
  lat: -22.9,
  lng: -47.0,
  areaTotal: 200,
}

describe('terrenoInputSchema', () => {
  it('aceita um input mínimo válido', () => {
    expect(terrenoInputSchema.safeParse(valid).success).toBe(true)
  })

  it('rejeita rua vazia', () => {
    expect(terrenoInputSchema.safeParse({ ...valid, rua: '' }).success).toBe(false)
  })

  it('rejeita areaTotal não positiva', () => {
    expect(terrenoInputSchema.safeParse({ ...valid, areaTotal: 0 }).success).toBe(false)
  })

  it('rejeita link que não é URL', () => {
    expect(terrenoInputSchema.safeParse({ ...valid, link: 'não-é-url' }).success).toBe(false)
  })

  it('aceita medidas e imagens opcionais', () => {
    const result = terrenoInputSchema.safeParse({
      ...valid,
      largura: 10,
      comprimento: 20,
      imagens: [{ id: 'img-1', url: 'https://x/1.jpg' }],
      principalId: 'img-1',
    })
    expect(result.success).toBe(true)
  })
})
