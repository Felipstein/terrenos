import { describe, expect, it } from 'vitest'
import { terrenoSchema } from './terreno-validation'

const base = { rua: 'Rua A, 1', preco: 100000, lat: -22.9, lng: -47.0, areaTotal: 200 }

describe('terrenoSchema', () => {
  it('aceita um input válido (sem opcionais)', () => {
    expect(terrenoSchema.safeParse(base).success).toBe(true)
  })

  it('aceita largura/comprimento/link opcionais', () => {
    const r = terrenoSchema.safeParse({ ...base, largura: 10, comprimento: 20, link: 'https://x.com' })
    expect(r.success).toBe(true)
  })

  it('rejeita rua vazia', () => {
    expect(terrenoSchema.safeParse({ ...base, rua: '  ' }).success).toBe(false)
  })

  it('aceita preço ausente (a negociar)', () => {
    const { preco, ...semPreco } = base
    void preco
    expect(terrenoSchema.safeParse(semPreco).success).toBe(true)
    expect(terrenoSchema.safeParse({ ...semPreco, preco: '' }).success).toBe(true)
  })

  it('rejeita preço <= 0 quando informado', () => {
    expect(terrenoSchema.safeParse({ ...base, preco: 0 }).success).toBe(false)
  })

  it('rejeita área <= 0', () => {
    expect(terrenoSchema.safeParse({ ...base, areaTotal: 0 }).success).toBe(false)
  })

  it('rejeita link inválido', () => {
    expect(terrenoSchema.safeParse({ ...base, link: 'nao-e-url' }).success).toBe(false)
  })
})
