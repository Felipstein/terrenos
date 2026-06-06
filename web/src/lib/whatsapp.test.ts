import { describe, expect, it } from 'vitest'
import { buildWhatsappUrl, isValidWhatsapp, whatsappDigits } from './whatsapp'

describe('whatsappDigits', () => {
  it('prefixa DDI 55 em número BR sem DDI (10 ou 11 dígitos)', () => {
    expect(whatsappDigits('(45) 99999-0000')).toBe('5545999990000')
    expect(whatsappDigits('45 3333-0000')).toBe('554533330000')
  })

  it('mantém quando já tem DDI', () => {
    expect(whatsappDigits('+55 45 99999-0000')).toBe('5545999990000')
  })
})

describe('buildWhatsappUrl', () => {
  it('monta o link wa.me com os dígitos normalizados', () => {
    expect(buildWhatsappUrl('(45) 99999-0000')).toBe('https://wa.me/5545999990000')
  })
})

describe('isValidWhatsapp', () => {
  it('aceita 10–13 dígitos em formatos comuns', () => {
    expect(isValidWhatsapp('(45) 99999-0000')).toBe(true)
    expect(isValidWhatsapp('+55 45 99999-0000')).toBe(true)
  })

  it('rejeita curto demais ou lixo', () => {
    expect(isValidWhatsapp('123')).toBe(false)
    expect(isValidWhatsapp('abc')).toBe(false)
  })
})
