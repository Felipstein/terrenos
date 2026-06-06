import { describe, expect, it } from 'vitest'
import { slugify } from '../../src/domain/corretora/slug'
import { makeCorretora } from '../../src/domain/corretora/corretora'

describe('slugify', () => {
  it('minúsculas, sem acento, com hífens', () => {
    expect(slugify('Imobiliária Silva')).toBe('imobiliaria-silva')
    expect(slugify('São João & Cia!')).toBe('sao-joao-cia')
  })

  it('colapsa espaços/símbolos e apara pontas', () => {
    expect(slugify('  imobiliária   silva  ')).toBe('imobiliaria-silva')
  })

  it('retorna vazio quando não sobra nada', () => {
    expect(slugify('---')).toBe('')
    expect(slugify('🏠')).toBe('')
  })
})

describe('makeCorretora', () => {
  it('preserva o nome trimado e deriva o slug', () => {
    expect(makeCorretora('  Imobiliária Silva ')).toEqual({
      slug: 'imobiliaria-silva',
      name: 'Imobiliária Silva',
    })
  })

  it('caixa/acento diferentes geram o mesmo slug', () => {
    expect(makeCorretora('imobiliaria silva')?.slug).toBe(makeCorretora('Imobiliária Silva')?.slug)
  })

  it('retorna undefined pra nome vazio ou só símbolos', () => {
    expect(makeCorretora(undefined)).toBeUndefined()
    expect(makeCorretora('   ')).toBeUndefined()
    expect(makeCorretora('!!!')).toBeUndefined()
  })
})
