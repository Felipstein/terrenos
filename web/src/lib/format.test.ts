import { describe, expect, it } from 'vitest'
import {
  displayPrice,
  displayPricePerSqm,
  displayPriceShort,
  formatArea,
  formatPrice,
  formatPricePerSqm,
  formatPriceShort,
  pricePerSquareMeter,
  PRICE_TBD,
} from './format'

describe('formatPrice', () => {
  it('formata em reais sem centavos', () => {
    expect(formatPrice(185000)).toBe('R$ 185.000')
  })
})

describe('formatArea', () => {
  it('formata metros quadrados', () => {
    expect(formatArea(250)).toBe('250 m²')
    expect(formatArea(1250)).toBe('1.250 m²')
  })
})

describe('formatPriceShort', () => {
  it('usa mil para milhares', () => {
    expect(formatPriceShort(185000)).toBe('R$ 185 mil')
  })

  it('usa M para milhões', () => {
    expect(formatPriceShort(1_500_000)).toBe('R$ 1,5M')
  })

  it('mantém valor cheio abaixo de mil', () => {
    expect(formatPriceShort(900)).toBe('R$ 900')
  })
})

describe('displayPrice / displayPriceShort', () => {
  it('formata quando há valor', () => {
    expect(displayPrice(185000)).toBe('R$ 185.000')
    expect(displayPriceShort(185000)).toBe('R$ 185 mil')
  })

  it('usa o rótulo "Sob consulta" quando não há preço', () => {
    expect(displayPrice(undefined)).toBe(PRICE_TBD)
    expect(displayPriceShort(undefined)).toBe(PRICE_TBD)
  })
})

describe('pricePerSquareMeter', () => {
  it('calcula preço / área total', () => {
    expect(pricePerSquareMeter(100000, 500)).toBe(200)
  })

  it('é indefinido sem preço', () => {
    expect(pricePerSquareMeter(undefined, 500)).toBeUndefined()
  })

  it('é indefinido com área não positiva', () => {
    expect(pricePerSquareMeter(100000, 0)).toBeUndefined()
  })
})

describe('formatPricePerSqm / displayPricePerSqm', () => {
  it('formata compacto arredondando os reais', () => {
    expect(formatPricePerSqm(333.33)).toBe('R$ 333/m²')
  })

  it('usa "—" quando não há valor', () => {
    expect(displayPricePerSqm(undefined)).toBe('—')
    expect(displayPricePerSqm(200)).toBe('R$ 200/m²')
  })
})
