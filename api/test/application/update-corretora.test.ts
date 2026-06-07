import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateCorretora } from '../../src/application/corretora/update-corretora'
import { NotFoundError } from '../../src/domain/errors'
import { FakeCorretoraRepository } from '../support/fake-corretora-repository'

const ACCOUNT = 'acct-1'

let corretoras: FakeCorretoraRepository

beforeEach(async () => {
  corretoras = new FakeCorretoraRepository()
  await corretoras.put(ACCOUNT, { slug: 'imobiliaria-silva', name: 'Imobiliária Silva' })
})

describe('UpdateCorretora', () => {
  it('adiciona telefone a uma corretora sem telefone', async () => {
    const updated = await new UpdateCorretora(corretoras).execute(ACCOUNT, 'imobiliaria-silva', {
      phone: '(45) 3333-0000',
    })
    expect(updated).toEqual({
      slug: 'imobiliaria-silva',
      name: 'Imobiliária Silva',
      phone: '(45) 3333-0000',
    })
  })

  it('renomeia mantendo o slug estável', async () => {
    const updated = await new UpdateCorretora(corretoras).execute(ACCOUNT, 'imobiliaria-silva', {
      name: 'Imobiliária Silva & Filhos',
    })
    expect(updated.slug).toBe('imobiliaria-silva')
    expect(updated.name).toBe('Imobiliária Silva & Filhos')
  })

  it('limpa o telefone com string vazia', async () => {
    await corretoras.put(ACCOUNT, {
      slug: 'imobiliaria-silva',
      name: 'Imobiliária Silva',
      phone: '(45) 3333-0000',
    })
    const updated = await new UpdateCorretora(corretoras).execute(ACCOUNT, 'imobiliaria-silva', {
      phone: '',
    })
    expect(updated).not.toHaveProperty('phone')
  })

  it('preserva o telefone quando não enviado', async () => {
    await corretoras.put(ACCOUNT, {
      slug: 'imobiliaria-silva',
      name: 'Imobiliária Silva',
      phone: '(45) 3333-0000',
    })
    const updated = await new UpdateCorretora(corretoras).execute(ACCOUNT, 'imobiliaria-silva', {
      name: 'Outro Nome',
    })
    expect(updated.phone).toBe('(45) 3333-0000')
  })

  it('lança NotFound quando a corretora não existe', async () => {
    await expect(
      new UpdateCorretora(corretoras).execute(ACCOUNT, 'inexistente', { phone: '1' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
