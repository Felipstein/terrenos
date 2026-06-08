import type { CorretoraRepository } from '../ports/corretora-repository'
import { makeCorretora, normalizePhone } from '../../domain/corretora/corretora'

/**
 * Resolve o nome de corretora digitado num NOME CANÔNICO, com upsert por slug:
 * - Se já existe uma corretora com o mesmo slug, reusa o NOME dela (o 1º cadastro
 *   vence — não recadastra "Imob X" vs "imob x"). Se veio telefone novo, atualiza
 *   o telefone da corretora existente (deixa o usuário completar dados antigos
 *   pelo próprio form de terreno).
 * - Senão, cria a corretora (com telefone, se houver).
 *
 * Retorna o nome canônico, ou `undefined` quando não há corretora (campo vazio
 * ou só símbolos).
 */
export async function resolveCorretoraName(
  corretoras: CorretoraRepository,
  accountId: string,
  name: string | undefined,
  phone?: string | undefined,
): Promise<string | undefined> {
  const corretora = makeCorretora(name, phone)
  if (!corretora) return undefined
  const existing = await corretoras.get(accountId, corretora.slug)
  if (existing) {
    const nextPhone = normalizePhone(phone)
    if (nextPhone !== undefined && nextPhone !== existing.phone) {
      await corretoras.put(accountId, { ...existing, phone: nextPhone })
    }
    return existing.name
  }
  await corretoras.put(accountId, corretora)
  return corretora.name
}
