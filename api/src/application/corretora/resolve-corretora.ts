import type { CorretoraRepository } from '../ports/corretora-repository'
import { makeCorretora } from '../../domain/corretora/corretora'

/**
 * Resolve o nome de corretora digitado num NOME CANÔNICO, com upsert por slug:
 * se já existe uma corretora com o mesmo slug, reusa o nome dela (o 1º cadastro
 * vence — não recadastra "Imob X" vs "imob x"); senão, cria. Retorna `undefined`
 * quando não há corretora (campo vazio ou só símbolos).
 */
export async function resolveCorretoraName(
  corretoras: CorretoraRepository,
  accountId: string,
  name: string | undefined,
): Promise<string | undefined> {
  const corretora = makeCorretora(name)
  if (!corretora) return undefined
  const existing = await corretoras.get(accountId, corretora.slug)
  if (existing) return existing.name
  await corretoras.put(accountId, corretora)
  return corretora.name
}
