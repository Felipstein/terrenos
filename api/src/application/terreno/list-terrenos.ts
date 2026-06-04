import type { TerrenoRepository } from '../ports/terreno-repository'
import type { Terreno } from '../../domain/terreno/terreno'

/** Lista todos os terrenos da conta. Busca/ordenação ficam no front. */
export class ListTerrenos {
  constructor(private readonly terrenos: TerrenoRepository) {}

  execute(accountId: string): Promise<Terreno[]> {
    return this.terrenos.list(accountId)
  }
}
