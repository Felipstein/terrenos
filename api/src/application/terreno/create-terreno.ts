import { randomUUID } from 'node:crypto'
import type { TerrenoRepository } from '../ports/terreno-repository'
import type { CorretoraRepository } from '../ports/corretora-repository'
import { makeTerreno, type Terreno, type TerrenoInput } from '../../domain/terreno/terreno'
import { resolveCorretoraName } from '../corretora/resolve-corretora'

/** Cria um terreno na conta. O `id` é gerado aqui (servidor é a fonte da verdade). */
export class CreateTerreno {
  constructor(
    private readonly terrenos: TerrenoRepository,
    private readonly corretoras: CorretoraRepository,
  ) {}

  async execute(accountId: string, input: TerrenoInput): Promise<Terreno> {
    const corretora = await resolveCorretoraName(this.corretoras, accountId, input.corretora)
    const terreno = makeTerreno(
      { ...input, corretora },
      { id: randomUUID(), now: new Date().toISOString() },
    )
    await this.terrenos.put(accountId, terreno)
    return terreno
  }
}
