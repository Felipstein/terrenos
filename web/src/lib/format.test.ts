import { describe, expect, it } from 'vitest'
import { formatArea, formatPrice, formatPriceShort } from './format'

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
