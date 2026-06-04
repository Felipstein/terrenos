import type { TerrenoRepository } from '../../src/application/ports/terreno-repository'
import type { Terreno } from '../../src/domain/terreno/terreno'

/** Repositório in-memory pra testar use cases sem AWS. Escopado por conta. */
export class FakeTerrenoRepository implements TerrenoRepository {
  private readonly store = new Map<string, Terreno>()

  private key(accountId: string, id: string): string {
    return `${accountId}/${id}`
  }

  async list(accountId: string): Promise<Terreno[]> {
    return [...this.store.entries()]
      .filter(([key]) => key.startsWith(`${accountId}/`))
      .map(([, terreno]) => terreno)
  }

  async get(accountId: string, id: string): Promise<Terreno | null> {
    return this.store.get(this.key(accountId, id)) ?? null
  }

  async put(accountId: string, terreno: Terreno): Promise<void> {
    this.store.set(this.key(accountId, terreno.id), terreno)
  }

  async delete(accountId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(accountId, id))
  }
}
