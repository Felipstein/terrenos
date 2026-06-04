import { DomainError, type DomainErrorCode } from '../domain/errors'
import { failure, type HttpResponse } from './response'

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  NOT_FOUND: 404,
  VALIDATION: 422,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
}

/**
 * Traduz qualquer erro numa resposta HTTP. Erros de domínio viram o status do
 * seu `code`; o resto vira 500 (com log do erro real, mensagem genérica pro
 * cliente — não vaza detalhe interno).
 */
export function mapError(error: unknown): HttpResponse {
  if (error instanceof DomainError) {
    return failure(STATUS_BY_CODE[error.code], error.message)
  }
  console.error('Erro não tratado:', error)
  return failure(500, 'Erro interno')
}
