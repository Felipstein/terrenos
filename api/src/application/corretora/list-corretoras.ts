import type { CorretoraRepository } from '../ports/corretora-repository'
import type { Corretora } from '../../domain/corretora/corretora'

/** Lista as corretoras da conta (ordenadas por nome) pra autocomplete e filtro. */
export class ListCorretoras {
  constructor(private readonly corretoras: CorretoraRepository) {}

  async execute(accountId: string): Promise<Corretora[]> {
    const list = await this.corretoras.list(accountId)
    return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }
}
