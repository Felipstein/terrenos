import type { TerrenoRepository } from '../ports/terreno-repository'
import { NotFoundError } from '../../domain/errors'

/** Remove um terreno. 404 se não existir na conta. */
export class DeleteTerreno {
  constructor(private readonly terrenos: TerrenoRepository) {}

  async execute(accountId: string, id: string): Promise<void> {
    const deleted = await this.terrenos.delete(accountId, id)
    if (!deleted) {
      throw new NotFoundError('Terreno não encontrado')
    }
  }
}
