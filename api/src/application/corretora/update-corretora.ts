import type { CorretoraRepository } from '../ports/corretora-repository'
import { normalizePhone, type Corretora } from '../../domain/corretora/corretora'
import { NotFoundError } from '../../domain/errors'

/** Campos editáveis de uma corretora (atualização parcial). */
export type CorretoraUpdate = {
  name?: string
  phone?: string
}

/**
 * Atualiza uma corretora existente (nome e/ou telefone), mantendo o `slug`
 * estável (é a identidade/chave de dedup). 404 se não existir na conta.
 *
 * - `name` ausente → preserva o nome atual; presente → renomeia (sem mexer no slug).
 * - `phone` ausente → preserva; string vazia → limpa; com valor → grava.
 */
export class UpdateCorretora {
  constructor(private readonly corretoras: CorretoraRepository) {}

  async execute(accountId: string, slug: string, update: CorretoraUpdate): Promise<Corretora> {
    const existing = await this.corretoras.get(accountId, slug)
    if (existing === null) {
      throw new NotFoundError('Corretora não encontrada')
    }
    const name = update.name?.trim() ? update.name.trim() : existing.name
    const phone = update.phone === undefined ? existing.phone : normalizePhone(update.phone)
    const updated: Corretora =
      phone === undefined ? { slug: existing.slug, name } : { slug: existing.slug, name, phone }
    await this.corretoras.put(accountId, updated)
    return updated
  }
}
