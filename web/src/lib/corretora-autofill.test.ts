import { describe, expect, it } from 'vitest'
import { corretoraPhone, nextCorretoraTelefone } from './corretora-autofill'
import type { Corretora } from '../types/corretora'

const corretoras: Corretora[] = [
  { name: 'Imobiliária A', slug: 'imobiliaria-a', phone: '111' },
  { name: 'Imobiliária B', slug: 'imobiliaria-b' },
]

describe('corretoraPhone', () => {
  it('retorna o telefone da corretora conhecida', () => {
    expect(corretoraPhone(corretoras, 'Imobiliária A')).toBe('111')
  })

  it('undefined quando a corretora não tem telefone', () => {
    expect(corretoraPhone(corretoras, 'Imobiliária B')).toBeUndefined()
  })

  it('undefined pra nome desconhecido ou vazio', () => {
    expect(corretoraPhone(corretoras, 'Nova X')).toBeUndefined()
    expect(corretoraPhone(corretoras, undefined)).toBeUndefined()
    expect(corretoraPhone(corretoras, '')).toBeUndefined()
  })
})

describe('nextCorretoraTelefone (reconciliação ao trocar de corretora)', () => {
  it('autopreenche com o telefone da corretora escolhida', () => {
    expect(nextCorretoraTelefone(corretoras, 'Imobiliária A')).toBe('111')
  })

  // Regressão do bug de vazamento: ao sair de uma corretora COM telefone (A=111)
  // para uma corretora SEM telefone (B), o campo deve LIMPAR, não manter "111".
  it('limpa ao trocar de corretora-com-telefone para corretora-sem-telefone', () => {
    expect(corretoraPhone(corretoras, 'Imobiliária A')).toBe('111')
    expect(nextCorretoraTelefone(corretoras, 'Imobiliária B')).toBe('')
  })

  // Mesmo cenário ao digitar um NOME NOVO (cria corretora nova no upsert): não
  // pode herdar o telefone da corretora anterior.
  it('limpa ao trocar de corretora-com-telefone para um nome novo digitado', () => {
    expect(nextCorretoraTelefone(corretoras, 'Imobiliária Nova')).toBe('')
  })

  it('limpa quando a corretora é removida (nome vazio)', () => {
    expect(nextCorretoraTelefone(corretoras, '')).toBe('')
  })
})
