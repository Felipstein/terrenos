import * as z from 'zod/mini'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { ValidationError } from '../domain/errors'

/**
 * Faz parse do corpo JSON contra um schema zod/mini. Falha de schema vira
 * `ValidationError` (422) com a primeira mensagem; JSON malformado idem.
 */
export function parseBody<S extends z.ZodMiniType>(
  event: APIGatewayProxyEventV2,
  schema: S,
): z.infer<S> {
  let raw: unknown
  try {
    raw = event.body ? JSON.parse(event.body) : {}
  } catch {
    throw new ValidationError('Corpo da requisição inválido')
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? 'Dados inválidos')
  }
  return result.data
}

/** Lê e valida um path parameter obrigatório. */
export function requirePathParam(event: APIGatewayProxyEventV2, name: string): string {
  const value = event.pathParameters?.[name]
  if (!value) {
    throw new ValidationError(`Parâmetro "${name}" ausente`)
  }
  return value
}
