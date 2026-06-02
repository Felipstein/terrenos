import { describe, expect, it } from 'vitest'
import { imagemPrincipal, imagensSecundarias } from './imagem'

const imagens = [
  { id: 'a', url: 'a.jpg' },
  { id: 'b', url: 'b.jpg' },
  { id: 'c', url: 'c.jpg' },
]

describe('imagemPrincipal', () => {
  it('retorna a marcada por principalId', () => {
    expect(imagemPrincipal({ imagens, principalId: 'b' })?.id).toBe('b')
  })

  it('cai na primeira quando não há principalId', () => {
    expect(imagemPrincipal({ imagens })?.id).toBe('a')
  })

  it('retorna undefined sem imagens', () => {
    expect(imagemPrincipal({ imagens: [] })).toBeUndefined()
    expect(imagemPrincipal({})).toBeUndefined()
  })
})

describe('imagensSecundarias', () => {
  it('exclui a principal', () => {
    expect(imagensSecundarias({ imagens, principalId: 'b' }).map((i) => i.id)).toEqual(['a', 'c'])
  })

  it('vazio quando não há imagens', () => {
    expect(imagensSecundarias({})).toEqual([])
  })
})
