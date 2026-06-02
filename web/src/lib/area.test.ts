import { describe, expect, it } from 'vitest'
import { recalcArea } from './area'

describe('recalcArea', () => {
  it('largura + comprimento => total', () => {
    expect(recalcArea('largura', { largura: 10, comprimento: 25 }).total).toBe(250)
    expect(recalcArea('comprimento', { largura: 10, comprimento: 25 }).total).toBe(250)
  })

  it('total + largura => comprimento', () => {
    expect(recalcArea('total', { total: 250, largura: 10 }).comprimento).toBe(25)
  })

  it('total + comprimento => largura', () => {
    expect(recalcArea('total', { total: 250, comprimento: 25 }).largura).toBe(10)
  })

  it('editar largura com total presente completa o comprimento', () => {
    expect(recalcArea('largura', { total: 250, largura: 10 }).comprimento).toBe(25)
  })

  it('arredonda em 2 casas', () => {
    expect(recalcArea('total', { total: 100, largura: 3 }).comprimento).toBe(33.33)
  })

  it('não calcula com um campo só', () => {
    expect(recalcArea('largura', { largura: 10 })).toEqual({ largura: 10 })
  })

  it('ignora valores inválidos (zero/negativo)', () => {
    expect(recalcArea('largura', { largura: 0, comprimento: 25 })).toEqual({
      largura: 0,
      comprimento: 25,
    })
  })
})
