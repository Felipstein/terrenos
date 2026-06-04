import type { Terreno } from '../../domain/terreno/terreno'

/**
 * Persistência de terrenos, escopada por conta. A implementação (DynamoDB
 * single-table) vive em `infra/`; os use cases só conhecem esta abstração.
 */
export interface TerrenoRepository {
  list(accountId: string): Promise<Terreno[]>
  get(accountId: string, id: string): Promise<Terreno | null>
  put(accountId: string, terreno: Terreno): Promise<void>
  /** Remove e devolve `true` se o terreno existia, `false` caso contrário. */
  delete(accountId: string, id: string): Promise<boolean>
}
