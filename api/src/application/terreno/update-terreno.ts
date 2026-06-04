import type { TerrenoRepository } from '../ports/terreno-repository'
import { applyTerrenoUpdate, type Terreno, type TerrenoInput } from '../../domain/terreno/terreno'
import { NotFoundError } from '../../domain/errors'

/** Atualiza um terreno existente. 404 se não pertencer à conta / não existir. */
export class UpdateTerreno {
  constructor(private readonly terrenos: TerrenoRepository) {}

  async execute(accountId: string, id: string, input: TerrenoInput): Promise<Terreno> {
    const existing = await this.terrenos.get(accountId, id)
    if (existing === null) {
      throw new NotFoundError('Terreno não encontrado')
    }
    const updated = applyTerrenoUpdate(existing, input, new Date().toISOString())
    await this.terrenos.put(accountId, updated)
    return updated
  }
}
