import type { TerrenoRepository } from '../ports/terreno-repository'
import type { CorretoraRepository } from '../ports/corretora-repository'
import { applyTerrenoUpdate, type Terreno, type TerrenoInput } from '../../domain/terreno/terreno'
import { resolveCorretoraName } from '../corretora/resolve-corretora'
import { NotFoundError } from '../../domain/errors'

/** Atualiza um terreno existente. 404 se não pertencer à conta / não existir. */
export class UpdateTerreno {
  constructor(
    private readonly terrenos: TerrenoRepository,
    private readonly corretoras: CorretoraRepository,
  ) {}

  async execute(accountId: string, id: string, input: TerrenoInput): Promise<Terreno> {
    const existing = await this.terrenos.get(accountId, id)
    if (existing === null) {
      throw new NotFoundError('Terreno não encontrado')
    }
    const corretora = await resolveCorretoraName(this.corretoras, accountId, input.corretora)
    const updated = applyTerrenoUpdate(existing, { ...input, corretora }, new Date().toISOString())
    await this.terrenos.put(accountId, updated)
    return updated
  }
}
