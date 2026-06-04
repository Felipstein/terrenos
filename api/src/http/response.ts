/** Resposta HTTP do API Gateway (httpApi / payload v2). */
export type HttpResponse = {
  statusCode: number
  headers?: Record<string, string>
  body?: string
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export function ok(data: unknown): HttpResponse {
  return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(data) }
}

export function created(data: unknown): HttpResponse {
  return { statusCode: 201, headers: JSON_HEADERS, body: JSON.stringify(data) }
}

export function noContent(): HttpResponse {
  return { statusCode: 204 }
}

/** Corpo de erro no formato do contrato (`{ message }`). */
export function failure(statusCode: number, message: string): HttpResponse {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify({ message }) }
}
