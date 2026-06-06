import type { CorretoraRepository } from '../../src/application/ports/corretora-repository'
import type { Corretora } from '../../src/domain/corretora/corretora'

/** Repositório in-memory pra testar use cases sem AWS. Escopado por conta. */
export class FakeCorretoraRepository implements CorretoraRepository {
  private readonly store = new Map<string, Corretora>()

  private key(accountId: string, slug: string): string {
    return `${accountId}/${slug}`
  }

  async list(accountId: string): Promise<Corretora[]> {
    return [...this.store.entries()]
      .filter(([key]) => key.startsWith(`${accountId}/`))
      .map(([, corretora]) => corretora)
  }

  async get(accountId: string, slug: string): Promise<Corretora | null> {
    return this.store.get(this.key(accountId, slug)) ?? null
  }

  async put(accountId: string, corretora: Corretora): Promise<void> {
    this.store.set(this.key(accountId, corretora.slug), corretora)
  }
}
