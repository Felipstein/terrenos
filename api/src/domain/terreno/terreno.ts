import type { TerrenoImage } from './terreno-image'
import { ValidationError } from '../errors'

/**
 * Entidade Terreno. Espelha o schema `Terreno` do contrato + carimbos de tempo.
 * `areaTotal` é em m²; `largura`/`comprimento` em metros. Todas as medidas são
 * opcionais — um terreno pode ser salvo sem nenhuma.
 */
export type Terreno = {
  id: string
  rua: string
  /** Se o terreno é de esquina. Obrigatório (itens antigos coagidos pra false na leitura). */
  isCorner: boolean
  preco?: number
  lat: number
  lng: number
  areaTotal?: number
  largura?: number
  comprimento?: number
  link?: string
  whatsapp?: string
  corretora?: string
  imagens?: TerrenoImage[]
  principalId?: string
  createdAt: string
  updatedAt: string
}

/** Dados de entrada (sem campos gerados pelo servidor). Igual ao `TerrenoInput` do contrato. */
export type TerrenoInput = Omit<Terreno, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Invariante de área: quando largura E comprimento existem, a área total é
 * derivada deles (fonte da verdade), ignorando o valor enviado. Sem as duas
 * medidas, usa a `areaTotal` informada (que também é opcional — pode ser
 * `undefined` quando o terreno é salvo sem nenhuma medida).
 */
function resolveAreaTotal(input: TerrenoInput): number | undefined {
  if (input.largura !== undefined && input.comprimento !== undefined) {
    return input.largura * input.comprimento
  }
  return input.areaTotal
}

/**
 * Invariante de imagem principal: se `principalId` aponta uma imagem, ela tem
 * que estar na lista `imagens`.
 */
function assertPrincipalIsValid(input: TerrenoInput): void {
  if (input.principalId === undefined) return
  const exists = input.imagens?.some((image) => image.id === input.principalId) ?? false
  if (!exists) {
    throw new ValidationError('A imagem principal não está na lista de imagens')
  }
}

/** Cria um terreno novo aplicando as invariantes de domínio. */
export function makeTerreno(input: TerrenoInput, params: { id: string; now: string }): Terreno {
  assertPrincipalIsValid(input)
  return {
    ...input,
    id: params.id,
    areaTotal: resolveAreaTotal(input),
    createdAt: params.now,
    updatedAt: params.now,
  }
}

/** Aplica uma edição preservando `id`/`createdAt` e revalidando as invariantes. */
export function applyTerrenoUpdate(existing: Terreno, input: TerrenoInput, now: string): Terreno {
  assertPrincipalIsValid(input)
  return {
    ...input,
    id: existing.id,
    areaTotal: resolveAreaTotal(input),
    createdAt: existing.createdAt,
    updatedAt: now,
  }
}
