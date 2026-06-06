import type { Corretora } from '../../domain/corretora/corretora'

/**
 * Persistência de corretoras, escopada por conta. Mesma tabela single-table dos
 * terrenos (SK = CORRETORA#<slug>). Os use cases só conhecem esta abstração.
 */
export interface CorretoraRepository {
  list(accountId: string): Promise<Corretora[]>
  get(accountId: string, slug: string): Promise<Corretora | null>
  put(accountId: string, corretora: Corretora): Promise<void>
}
