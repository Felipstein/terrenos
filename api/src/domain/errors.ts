/**
 * Erros de domínio. Cada um carrega um `code` estável que a camada HTTP
 * (`http/errors.ts`) traduz pra status code. A regra de negócio lança esses
 * erros sem saber nada de HTTP.
 */
export type DomainErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'UNAUTHORIZED' | 'BAD_REQUEST'

export abstract class DomainError extends Error {
  abstract readonly code: DomainErrorCode

  protected constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'
  constructor(message = 'Não encontrado') {
    super(message)
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION'
  constructor(message = 'Dados inválidos') {
    super(message)
  }
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED'
  constructor(message = 'Não autorizado') {
    super(message)
  }
}

export class BadRequestError extends DomainError {
  readonly code = 'BAD_REQUEST'
  constructor(message = 'Requisição inválida') {
    super(message)
  }
}
