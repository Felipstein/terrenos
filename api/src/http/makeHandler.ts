import { mapError } from './errors'
import type { HttpResponse } from './response'

/**
 * Embrulha um handler tipado: executa a lógica e converte qualquer exceção em
 * resposta HTTP via `mapError`. Cada função declara o tipo do `event` que
 * espera (público ou com JWT authorizer), e o `E` é inferido daí.
 */
export function makeHandler<E>(handler: (event: E) => Promise<HttpResponse>) {
  return async (event: E): Promise<HttpResponse> => {
    try {
      return await handler(event)
    } catch (error) {
      return mapError(error)
    }
  }
}
