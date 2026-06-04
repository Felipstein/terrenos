import { DomainError, type DomainErrorCode } from '../domain/errors'
import { failure, type HttpResponse } from './response'

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  NOT_FOUND: 404,
  VALIDATION: 422,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
}

/**
 * Achata um erro desconhecido numa mensagem legível, incluindo a cadeia de
 * `cause` (ex: o `ETIMEDOUT` que vem dentro de "fetch failed").
 */
function describeError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }
  let text = `${error.name}: ${error.message}`
  let cause: unknown = error.cause
  while (cause instanceof Error) {
    text += ` | cause: ${cause.name}: ${cause.message}`
    cause = cause.cause
  }
  if (cause !== undefined) {
    text += ` | cause: ${String(cause)}`
  }
  return text
}

/**
 * Traduz qualquer erro numa resposta HTTP. Erros de domínio viram o status do
 * seu `code`; o resto vira 500.
 */
export function mapError(error: unknown): HttpResponse {
  if (error instanceof DomainError) {
    return failure(STATUS_BY_CODE[error.code], error.message)
  }
  console.error('Erro não tratado:', error)
  return failure(500, describeError(error))
}
