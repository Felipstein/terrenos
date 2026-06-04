import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTerreno } from '../../src/application/terreno/create-terreno'
import { ListTerrenos } from '../../src/application/terreno/list-terrenos'
import { UpdateTerreno } from '../../src/application/terreno/update-terreno'
import { DeleteTerreno } from '../../src/application/terreno/delete-terreno'
import { NotFoundError } from '../../src/domain/errors'
import type { TerrenoInput } from '../../src/domain/terreno/terreno'
import { FakeTerrenoRepository } from '../support/fake-terreno-repository'

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

beforeEach(() => {
  repository = new FakeTerrenoRepository()
})

describe('CreateTerreno', () => {
  it('cria com id gerado e persiste na conta', async () => {
    const terreno = await new CreateTerreno(repository).execute(ACCOUNT, input)
    expect(terreno.id).toBeTruthy()
    expect(await repository.get(ACCOUNT, terreno.id)).toEqual(terreno)
  })
})

describe('ListTerrenos', () => {
  it('lista só os terrenos da conta', async () => {
    const create = new CreateTerreno(repository)
    await create.execute(ACCOUNT, input)
    await create.execute(ACCOUNT, input)
    await create.execute(OTHER_ACCOUNT, input)

    const list = await new ListTerrenos(repository).execute(ACCOUNT)
    expect(list).toHaveLength(2)
  })
})

describe('UpdateTerreno', () => {
  it('atualiza um terreno existente', async () => {
    const created = await new CreateTerreno(repository).execute(ACCOUNT, input)
    const updated = await new UpdateTerreno(repository).execute(ACCOUNT, created.id, {
      ...input,
      preco: 150000,
    })
    expect(updated.preco).toBe(150000)
    expect(updated.id).toBe(created.id)
  })

  it('lança NotFound quando o terreno não existe', async () => {
    await expect(
      new UpdateTerreno(repository).execute(ACCOUNT, 'inexistente', input),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('não atualiza terreno de outra conta', async () => {
    const created = await new CreateTerreno(repository).execute(OTHER_ACCOUNT, input)
    await expect(
      new UpdateTerreno(repository).execute(ACCOUNT, created.id, input),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe('DeleteTerreno', () => {
  it('remove um terreno existente', async () => {
    const created = await new CreateTerreno(repository).execute(ACCOUNT, input)
    await new DeleteTerreno(repository).execute(ACCOUNT, created.id)
    expect(await repository.get(ACCOUNT, created.id)).toBeNull()
  })

  it('lança NotFound quando não existe', async () => {
    await expect(
      new DeleteTerreno(repository).execute(ACCOUNT, 'inexistente'),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
