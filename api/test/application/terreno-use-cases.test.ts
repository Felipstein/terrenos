import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTerreno } from '../../src/application/terreno/create-terreno'
import { ListTerrenos } from '../../src/application/terreno/list-terrenos'
import { UpdateTerreno } from '../../src/application/terreno/update-terreno'
import { DeleteTerreno } from '../../src/application/terreno/delete-terreno'
import { NotFoundError } from '../../src/domain/errors'
import type { TerrenoInput } from '../../src/domain/terreno/terreno'
import { FakeTerrenoRepository } from '../support/fake-terreno-repository'
import { FakeCorretoraRepository } from '../support/fake-corretora-repository'

const ACCOUNT = 'acct-1'
const OTHER_ACCOUNT = 'acct-2'

const input: TerrenoInput = {
  rua: 'Rua A',
  preco: 100000,
  lat: -22.9,
  lng: -47.0,
  areaTotal: 200,
}

let repository: FakeTerrenoRepository
let corretoras: FakeCorretoraRepository

beforeEach(() => {
  repository = new FakeTerrenoRepository()
  corretoras = new FakeCorretoraRepository()
})

describe('CreateTerreno', () => {
  it('cria com id gerado e persiste na conta', async () => {
    const terreno = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, input)
    expect(terreno.id).toBeTruthy()
    expect(await repository.get(ACCOUNT, terreno.id)).toEqual(terreno)
  })
})

describe('ListTerrenos', () => {
  it('lista só os terrenos da conta', async () => {
    const create = new CreateTerreno(repository, corretoras)
    await create.execute(ACCOUNT, input)
    await create.execute(ACCOUNT, input)
    await create.execute(OTHER_ACCOUNT, input)

    const list = await new ListTerrenos(repository).execute(ACCOUNT)
    expect(list).toHaveLength(2)
  })
})

describe('UpdateTerreno', () => {
  it('atualiza um terreno existente', async () => {
    const created = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, input)
    const updated = await new UpdateTerreno(repository, corretoras).execute(ACCOUNT, created.id, {
      ...input,
      preco: 150000,
    })
    expect(updated.preco).toBe(150000)
    expect(updated.id).toBe(created.id)
  })

  it('lança NotFound quando o terreno não existe', async () => {
    await expect(
      new UpdateTerreno(repository, corretoras).execute(ACCOUNT, 'inexistente', input),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('não atualiza terreno de outra conta', async () => {
    const created = await new CreateTerreno(repository, corretoras).execute(OTHER_ACCOUNT, input)
    await expect(
      new UpdateTerreno(repository, corretoras).execute(ACCOUNT, created.id, input),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe('DeleteTerreno', () => {
  it('remove um terreno existente', async () => {
    const created = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, input)
    await new DeleteTerreno(repository).execute(ACCOUNT, created.id)
    expect(await repository.get(ACCOUNT, created.id)).toBeNull()
  })

  it('lança NotFound quando não existe', async () => {
    await expect(
      new DeleteTerreno(repository).execute(ACCOUNT, 'inexistente'),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe('Terreno + Corretora', () => {
  it('embute o nome da corretora e a registra na conta', async () => {
    const terreno = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, {
      ...input,
      corretora: 'Imobiliária Silva',
    })
    expect(terreno.corretora).toBe('Imobiliária Silva')
    expect(await corretoras.list(ACCOUNT)).toEqual([
      { slug: 'imobiliaria-silva', name: 'Imobiliária Silva' },
    ])
  })

  it('deduplica por slug e mantém o nome canônico do 1º cadastro', async () => {
    const create = new CreateTerreno(repository, corretoras)
    await create.execute(ACCOUNT, { ...input, corretora: 'Imobiliária Silva' })
    const segundo = await create.execute(ACCOUNT, { ...input, corretora: 'imobiliaria silva' })

    expect(segundo.corretora).toBe('Imobiliária Silva') // nome canônico, não a 2ª variante
    expect(await corretoras.list(ACCOUNT)).toHaveLength(1)
  })

  it('terreno sem corretora não cria corretora', async () => {
    const terreno = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, input)
    expect(terreno.corretora).toBeUndefined()
    expect(await corretoras.list(ACCOUNT)).toHaveLength(0)
  })

  it('editar troca a corretora do terreno', async () => {
    const created = await new CreateTerreno(repository, corretoras).execute(ACCOUNT, {
      ...input,
      corretora: 'Imobiliária Silva',
    })
    const updated = await new UpdateTerreno(repository, corretoras).execute(ACCOUNT, created.id, {
      ...input,
      corretora: 'Corretora Nova',
    })
    expect(updated.corretora).toBe('Corretora Nova')
    expect(await corretoras.list(ACCOUNT)).toHaveLength(2)
  })
})
