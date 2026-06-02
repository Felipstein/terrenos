import { describe, expect, it } from 'vitest'
import type { Terreno } from '../types/terreno'
import { createMemoryTerrenoService } from './terreno-service'
import { seedTerrenos } from './seed'

function terreno(id: string): Terreno {
  return { id, rua: 'Rua X, 1', preco: 100000, lat: -22.9, lng: -47.0, areaTotal: 200 }
}

describe('createMemoryTerrenoService', () => {
  it('começa com o mock (seed)', async () => {
    const service = createMemoryTerrenoService()
    expect(await service.list()).toHaveLength(seedTerrenos.length)
  })

  it('adiciona um novo terreno', async () => {
    const service = createMemoryTerrenoService([])
    await service.save(terreno('novo-1'))
    expect((await service.list()).some((t) => t.id === 'novo-1')).toBe(true)
  })

  it('atualiza um terreno existente em vez de duplicar', async () => {
    const service = createMemoryTerrenoService([])
    await service.save(terreno('x'))
    await service.save({ ...terreno('x'), preco: 999000 })
    const all = (await service.list()).filter((t) => t.id === 'x')
    expect(all).toHaveLength(1)
    expect(all[0].preco).toBe(999000)
  })

  it('remove um terreno', async () => {
    const service = createMemoryTerrenoService([])
    await service.save(terreno('rm'))
    await service.remove('rm')
    expect((await service.list()).some((t) => t.id === 'rm')).toBe(false)
  })

  it('não compartilha estado entre instâncias', async () => {
    const a = createMemoryTerrenoService([])
    const b = createMemoryTerrenoService([])
    await a.save(terreno('só-no-a'))
    expect(await b.list()).toHaveLength(0)
  })
})
