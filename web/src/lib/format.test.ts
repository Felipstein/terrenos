import { describe, expect, it } from 'vitest'
import {
  displayPrice,
  displayPricePerSqm,
  displayPriceShort,
  formatArea,
  formatDimensions,
  formatMeasure,
  formatNumber,
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

describe('formatNumber', () => {
  it('limita a 2 casas decimais na exibição (lixo de ponto flutuante)', () => {
    expect(formatNumber(269.83000000000004)).toBe('269,83')
    expect(formatNumber(249.95999999999998)).toBe('249,96')
  })

  it('remove zeros à direita — o requisito é o teto, não forçar 2 casas', () => {
    expect(formatNumber(300)).toBe('300')
    expect(formatNumber(267.6)).toBe('267,6')
  })

  it('arredonda a 3ª casa em diante', () => {
    expect(formatNumber(10.005)).toBe('10,01')
    expect(formatNumber(10.004)).toBe('10')
  })
})

describe('formatArea', () => {
  it('formata metros quadrados', () => {
    expect(formatArea(250)).toBe('250 m²')
    expect(formatArea(1250)).toBe('1.250 m²')
  })

  it('limita a área a 2 casas decimais', () => {
    expect(formatArea(269.83000000000004)).toBe('269,83 m²')
  })
})

describe('formatMeasure', () => {
  it('formata metros com teto de 2 casas', () => {
    expect(formatMeasure(15)).toBe('15 m')
    expect(formatMeasure(15.123456)).toBe('15,12 m')
  })
})

describe('formatDimensions', () => {
  it('monta L×C com teto de 2 casas em cada lado', () => {
    expect(formatDimensions(15, 17.989)).toBe('15×17,99')
  })

  it('é indefinido sem largura ou comprimento', () => {
    expect(formatDimensions(undefined, 10)).toBeUndefined()
    expect(formatDimensions(10, undefined)).toBeUndefined()
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

  it('mantém valor cheio até 9.999 (precisão no caso comum)', () => {
    expect(formatPricePerSqm(3000)).toBe('R$ 3.000/m²')
    expect(formatPricePerSqm(9999)).toBe('R$ 9.999/m²')
  })

  it('usa sufixo K a partir de 10 mil pra não estourar a coluna no mobile', () => {
    expect(formatPricePerSqm(10_000)).toBe('R$ 10K/m²')
    expect(formatPricePerSqm(500_000)).toBe('R$ 500K/m²')
    expect(formatPricePerSqm(12_500)).toBe('R$ 12,5K/m²')
  })

  it('usa "—" quando não há valor', () => {
    expect(displayPricePerSqm(undefined)).toBe('—')
    expect(displayPricePerSqm(200)).toBe('R$ 200/m²')
  })
})
