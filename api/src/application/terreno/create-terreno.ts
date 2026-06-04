import { randomUUID } from 'node:crypto'
import type { TerrenoRepository } from '../ports/terreno-repository'
import { makeTerreno, type Terreno, type TerrenoInput } from '../../domain/terreno/terreno'

/** Cria um terreno na conta. O `id` é gerado aqui (servidor é a fonte da verdade). */
export class CreateTerreno {
  constructor(private readonly terrenos: TerrenoRepository) {}

  async execute(accountId: string, input: TerrenoInput): Promise<Terreno> {
    const terreno = makeTerreno(input, { id: randomUUID(), now: new Date().toISOString() })
    await this.terrenos.put(accountId, terreno)
    return terreno
  }
}
